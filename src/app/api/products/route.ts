import { NextRequest, NextResponse } from "next/server";
import {
  queryProductByCompanyQuery,
} from "@/query/products";
import {
  TriplyDBClient,
  toJsonLdPayload,
  TriplyUploadError,
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
      const data = await TriplyDBClient.queryFromTriplyDB<ProductRow>(query);
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
      const data = await TriplyDBClient.fetchFromAPI<Product>("products");
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
  const companyName = process.env.COMPANY_NAME?.toLowerCase().replaceAll(" ", "-") || "example-manufacturer";
  const graphName = `urn:dpp:data:${companyName}`;

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  if (!requestBody || (typeof requestBody !== "object" && !Array.isArray(requestBody))) {
    return NextResponse.json(
      { error: "Request body must be a Product object or an array of Product objects." },
      { status: 400 },
    );
  }

  const inputProducts = Array.isArray(requestBody)
    ? (requestBody as Product[])
    : [requestBody as Product];

  if (inputProducts.length === 0) {
    return NextResponse.json(
      { error: "Product array cannot be empty." },
      { status: 400 },
    );
  }

  const products = inputProducts.map((item) => ({ ...item })) as Product[];
  for (const product of products) {
    product.label =
      product.productInfo?.identification?.productName || "Unnamed Product";
    product.id = `urn:product:generated:${crypto.randomUUID()}`;
  }

  try {
    const transformedProducts = await Promise.all(
      products.map((product) =>
        toJsonLdPayload(
          product as Record<string, unknown>,
          "dpp-core:Product",
          getContext,
          transformNestedObjects,
        ),
      ),
    );

    const jsonLdPayload =
      transformedProducts.length === 1
        ? transformedProducts[0]
        : {
            "@context": transformedProducts[0]["@context"],
            "@graph": transformedProducts.map((product) => {
              const graphItem = { ...product };
              delete graphItem["@context"];
              return graphItem;
            }),
          };

    const uploadResult = await TriplyDBClient.uploadToTriplyDB(jsonLdPayload, graphName);

    const isBatch = products.length > 1;

    return NextResponse.json({
      message: isBatch
        ? "Products created, transformed to one JSON-LD payload, and uploaded successfully."
        : "Product created, transformed to JSON-LD, and uploaded successfully.",
      product: isBatch ? undefined : products[0],
      products: isBatch ? products : undefined,
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
