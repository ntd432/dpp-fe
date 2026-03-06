import { NextRequest, NextResponse } from "next/server";
import { queryFromTriplyDB } from "@/lib/api";
import {
  queryProductByCompanyQuery,
  queryProductByGTINQuery,
} from "@/query/products";
import {
  toJsonLdPayload,
  TriplyUploadError,
  uploadToTriplyDB,
} from "@/lib/triplydb-client";
import { Product } from "@/types";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getDataLayer } from "@/config/DataLayerConfig";

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
];

/** Flat field names that belong to event groups (used to exclude from scalar copy) */
const EVENT_FIELD_NAMES = new Set(EVENT_GROUPS.flatMap((g) => g.fields));

/**
 * Aggregate flat SPARQL rows into a single product object.
 * Scalar fields are taken from the first row. Event-like fields that vary
 * across rows are collected into de-duplicated arrays.
 */
function aggregateRows(rows: ProductRow[]): Record<string, unknown> {
  if (rows.length === 0) return {};

  // 1. Copy all scalar (non-event) fields from the first row
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rows[0])) {
    if (!EVENT_FIELD_NAMES.has(key) && value !== undefined) {
      result[key] = value;
    }
  }

  // 2. Collect event arrays, de-duplicating by serialised value
  for (const group of EVENT_GROUPS) {
    const seen = new Set<string>();
    const items: Record<string, string>[] = [];

    for (const row of rows) {
      const product: Record<string, string> = {};
      let hasValue = false;
      for (const field of group.fields) {
        if (row[field]) {
          product[field] = row[field]!;
          hasValue = true;
        }
      }
      if (hasValue) {
        const key = JSON.stringify(product);
        if (!seen.has(key)) {
          seen.add(key);
          items.push(product);
        }
      }
    }

    if (items.length > 0) {
      result[group.arrayKey] = items;
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  const manufacturerId = request.nextUrl.searchParams.get("manufacturerId");
  const gtin = request.nextUrl.searchParams.get("gtin");

  // Query by GTIN — returns a single aggregated product
  if (gtin) {
    try {
      const query = queryProductByGTINQuery(gtin);
      const rows = await queryFromTriplyDB<ProductRow>(query);

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      const product = aggregateRows(rows);
      return NextResponse.json(product);
    } catch (error) {
      console.error("Failed to fetch product by GTIN:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 },
      );
    }
  }

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

  return NextResponse.json(
    { error: "Either 'manufacturerId' or 'gtin' query parameter is required" },
    { status: 400 },
  );
}

async function getContext(): Promise<Record<string, unknown>> {
  const contextsDir = join(process.cwd(), "src", "contexts");

  const [baseContextRaw, dppCoreContextRaw, dppProductInfoContextRaw] =
    await Promise.all([
      readFile(join(contextsDir, "base.context.jsonld"), "utf-8"),
      readFile(join(contextsDir, "dpp-core.context.jsonld"), "utf-8"),
      readFile(join(contextsDir, "dpp-product-info.context.jsonld"), "utf-8"),
    ]);

  const baseContext = JSON.parse(baseContextRaw) as {
    "@context": Record<string, unknown>;
  };
  const dppCoreContext = JSON.parse(dppCoreContextRaw) as {
    "@context": unknown[];
  };
  const dppProductInfoContext = JSON.parse(dppProductInfoContextRaw) as {
    "@context": unknown[];
  };

  const base = baseContext["@context"];
  const coreContextArray = dppCoreContext["@context"];
  const coreModule =
    coreContextArray.find(
      (entry) =>
        typeof entry === "object" && entry !== null && !Array.isArray(entry),
    ) ?? {};
  const productInfoContextArray = dppProductInfoContext["@context"];
  const productInfoModule =
    productInfoContextArray.find(
      (entry) =>
        typeof entry === "object" && entry !== null && !Array.isArray(entry),
    ) ?? {};

  return {
    ...base,
    ...(coreModule as Record<string, unknown>),
    ...(productInfoModule as Record<string, unknown>),
  };
}

function transformNestedObjects(product: Record<string, unknown>): void {
  let dataGroup: Record<string, unknown>[] = [];
  if (
    product.productInfo &&
    typeof product.productInfo === "object" &&
    product.productInfo !== null
  ) {
    dataGroup.push(
      transformProductInformation(
        product.productInfo as Record<string, unknown>,
      )
    );
  }

  delete product.productInfo;
  product.dataGroup = dataGroup;
}

function transformProductInformation(
  info: Record<string, unknown>,
): Record<string, unknown> {
  info["@type"] = "ProductInformation";
  if (!info.id) {
    info["@id"] = `urn:generated:product-info:${randomUUID()}`;
  }

  let dataPoint: Record<string, unknown>[] = [];
  if (info.identification && typeof info.identification === "object") {
    dataPoint.push(
      transformProductIdentificationInformation(
        info.identification as Record<string, unknown>,
      )
    );
  }

  if (info.manufacturer && typeof info.manufacturer === "object") {
    dataPoint.push(transformManufacturer(info.manufacturer as Record<string, unknown>));
  }

  delete info.identification;
  delete info.manufacturer;

  info.dataPoint = dataPoint;
  return info;
}

function transformManufacturer(
  manufacturer: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    "@type": "Manufacturer",
    "dataLayer": getDataLayer("Manufacturer"),
    "label": "Manufacturer",
  };
  result["@id"] = manufacturer.id ?? `urn:generated:manufacturer:${randomUUID()}`;

  if (manufacturer.manufacturerInfo && typeof manufacturer.manufacturerInfo === "object") {
    result.manufacturerInfo = transformOrganization(
      manufacturer.manufacturerInfo as Record<string, unknown>,
    );
  }
  // Copy other properties except those that are handled separately
  const handledKeys = new Set(["id", "@id", "@type", "manufacturerInfo"]);
  for (const [key, value] of Object.entries(manufacturer)) {
    if (!handledKeys.has(key)) result[key] = value;
  }
  return result;
}

function transformOrganization(
  org: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    "@type": "Organization",
  };
  result["@id"] = org.id ?? `urn:generated:organization:${randomUUID()}`;

  // Copy other properties except those that are handled separately
  const handledKeys = new Set(["id", "@id", "@type"]);
  for (const [key, value] of Object.entries(org)) {
    if (!handledKeys.has(key)) result[key] = value;
  }
  return result;
}

function transformProductIdentificationInformation(
  pii: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    "@type": "ProductIdentificationInformation",
    "dataLayer": getDataLayer("ProductIdentificationInformation"),
    "label": "Product Identification Information",
  };
  result["@id"] = pii.id ?? `urn:generated:pii:${randomUUID()}`;

  // Copy other properties except those that are handled separately
  const handledKeys = new Set(["id", "@id", "@type"]);
  for (const [key, value] of Object.entries(pii)) {
    if (!handledKeys.has(key)) result[key] = value;
  }
  return result;
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
    productData.productInfo?.identification?.name || "Unnamed Product";

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
      jsonLdPayload,
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
