import { NextRequest, NextResponse } from "next/server";
import { queryFromTriplyDB, fetchFromAPI } from "@/lib/api";
import {
  queryProductByCompanyQuery,
} from "@/query/products";
import {
  toJsonLdPayload,
  TriplyUploadError,
  uploadToTriplyDB,
} from "@/lib/triplydb-client";
import { getContext, transformNestedObjects } from "@/lib/transforms-jsonld/product";
import { Product } from "@/types";
import { getProductById } from "@/services/product.service";

/** Raw flat row returned by the SPARQL query */
interface ProductRow {
  [key: string]: string | undefined;
}

/**
 * Fields that can differ across rows for the same product (due to multiple
 * traceability events, maintenance logs, etc.).  Each "event group" lists the
 * flat keys that belong together — they will be collected into arrays of
 * objects on the aggregated result.
 */
const EVENT_GROUPS: { arrayKey: string; fields: string[] }[] = [
  {
    arrayKey: "traceabilityEvents",
    fields: [
      "traceActionName",
      "traceActionType",
      "traceTime",
      "traceLocation",
    ],
  },
  {
    arrayKey: "maintenanceEvents",
    fields: ["maintActionName", "maintTime"],
  },
  {
    arrayKey: "usageEvents",
    fields: ["usageActionName", "usageTime"],
  },
  {
    arrayKey: "incidentEvents",
    fields: ["incidentActionName", "incidentTime"],
  },
  {
    arrayKey: "environmentalImpacts",
    fields: [
      "impactCategory",
      "impactMethod",
      "impactFactor",
      "impactModel",
      "impactIndicatorValue",
      "impactIndicatorUnit",
    ],
  },
];

/** Flat field names that belong to event groups (used to exclude from scalar copy) */
const EVENT_FIELD_NAMES = new Set(EVENT_GROUPS.flatMap((g) => g.fields));

function copyScalarFields(row: ProductRow): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    if (!EVENT_FIELD_NAMES.has(key) && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

function collectGroupedItems(rows: ProductRow[], fields: string[]): Record<string, string>[] {
  const seen = new Set<string>();
  const items: Record<string, string>[] = [];

  for (const row of rows) {
    const item: Record<string, string> = {};

    for (const field of fields) {
      if (row[field]) {
        item[field] = row[field]!;
      }
    }

    if (Object.keys(item).length === 0) {
      continue;
    }

    const key = JSON.stringify(item);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    items.push(item);
  }

  return items;
}

/**
 * Aggregate flat SPARQL rows into a single product object.
 * Scalar fields are taken from the first row. Event-like fields that vary
 * across rows are collected into de-duplicated arrays.
 */
function aggregateRows(rows: ProductRow[]): Record<string, unknown> {
  if (rows.length === 0) return {};

  const result = copyScalarFields(rows[0]);

  for (const group of EVENT_GROUPS) {
    const items = collectGroupedItems(rows, group.fields);

    if (items.length > 0) {
      result[group.arrayKey] = items;
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  const manufacturerId = request.nextUrl.searchParams.get("manufacturerId");
  const id = request.nextUrl.searchParams.get("id");

  // Query by manufacturer ID — returns a list of products
  if (manufacturerId) {
    try {
      const query = queryProductByCompanyQuery(manufacturerId);
      const data = await queryFromTriplyDB<ProductRow>(query);
      return NextResponse.json(data);
    } catch (error) {
      console.error("Failed to fetch products by manufacturer:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }
  }

  if (id) {
    try {
      const product = await getProductById(id);
      return NextResponse.json(product);
    } catch (error) {
      console.error("Failed to fetch product by ID:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 },
      );
    }
  }

  try {
      const data = await fetchFromAPI<Product>("products");
      return NextResponse.json(data);
    } catch (error) {
      console.error("Failed to fetch all products:", error);
      return NextResponse.json(
        { error: "Failed to fetch all products" },
        { status: 500 },
      );
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.TRIPLYDB_TOKEN;
  const datasetName = process.env.DATASET_NAME;
  const companyName = process.env.COMPANY_NAME || "example-manufacturer";
  const graphName = `urn:dpp:data:${companyName}`;

  if (!token || !datasetName) {
    return NextResponse.json(
      {
        error:
          "Missing environment variables. TRIPLYDB_TOKEN and DATASET_NAME are required.",
      },
      { status: 500 },
    );
  }

  let productData: Product;
  try {
    productData = (await request.json()) as Product;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  productData.label =
    productData.productInfo?.identification?.productName || "Unnamed Product";
  productData.id = `urn:product:generated:${crypto.randomUUID()}`;

  try {
    const jsonLdPayload = await toJsonLdPayload(
      productData as Record<string, unknown>,
      "dpp-core:Product",
      getContext,
      transformNestedObjects,
    );

    const uploadResult = await uploadToTriplyDB(jsonLdPayload, {
      token,
      datasetName,
      graphName,
    });

    return NextResponse.json({
      message:
        "Product created, transformed to JSON-LD, and uploaded successfully.",
      product: productData,
      uploadResult,
    });
  } catch (error: unknown) {
    if (error instanceof TriplyUploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error during DPP upload test";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
