import { NextRequest, NextResponse } from "next/server";
import { queryFromTriplyDB } from "@/lib/api";
import {
  queryProductByCompanyQuery,
  queryProductByGTINQuery,
} from "@/query/products";

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
    fields: ["traceActionName", "traceActionType", "traceTime", "traceLocation"],
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
      const obj: Record<string, string> = {};
      let hasValue = false;
      for (const field of group.fields) {
        if (row[field]) {
          obj[field] = row[field]!;
          hasValue = true;
        }
      }
      if (hasValue) {
        const key = JSON.stringify(obj);
        if (!seen.has(key)) {
          seen.add(key);
          items.push(obj);
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
          { status: 404 }
        );
      }

      const product = aggregateRows(rows);
      return NextResponse.json(product);
    } catch (error) {
      console.error("Failed to fetch product by GTIN:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 }
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
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Either 'manufacturerId' or 'gtin' query parameter is required" },
    { status: 400 }
  );
}
