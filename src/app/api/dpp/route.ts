import App from "@triply/triplydb";
import { NextRequest, NextResponse } from "next/server";
import { toJsonLdPayload, TriplyUploadError, uploadToTriplyDB } from "@/lib/triplydb-client";
import type { DPP } from "@/types/dpp-core";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

async function getContext() {
  const contextsDir = join(process.cwd(), "src", "contexts");
  const [baseContextRaw, dppCoreContextRaw] = await Promise.all([
    readFile(join(contextsDir, "base.context.jsonld"), "utf-8"),
    readFile(join(contextsDir, "dpp-core.context.jsonld"), "utf-8"),
  ]);

  const baseContext = JSON.parse(baseContextRaw) as {
    "@context": Record<string, unknown>;
  };
  const dppCoreContext = JSON.parse(dppCoreContextRaw) as {
    "@context": unknown[];
  };

  const base = baseContext["@context"];
  const coreContextArray = dppCoreContext["@context"];
  const coreModule =
    coreContextArray.find(
      (entry) =>
        typeof entry === "object" && entry !== null && !Array.isArray(entry),
    ) ?? {};

  return {
    ...base,
    ...(coreModule as Record<string, unknown>),
  };
}

function transformNestedObjects(dpp: Record<string, unknown>): void {
  if (dpp.product && typeof dpp.product === "object" && dpp.product !== null) {
    dpp.product = transformProduct(dpp.product as Record<string, unknown>);
  }
}

function transformProduct(
  product: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { "@type": "Product" };
  result["@id"] = product.id ?? `urn:generated:product:${randomUUID()}`

  // Copy other properties except those that are handled separately
  const handledKeys = new Set(["id", "@id", "@type"]);
  for (const [key, value] of Object.entries(product)) {
    if (!handledKeys.has(key)) result[key] = value;
  }
  return result;
}

export async function GET() {
  const datasetName = process.env.DATASET_NAME;

  if (!datasetName) {
    return NextResponse.json(
      { error: "Missing environment variable DATASET_NAME." },
      { status: 500 },
    );
  }

  const triply = App.get({ token: process.env.TRIPLYDB_TOKEN });
  const account = await triply.getAccount();
  const dataset = await account.getDataset(datasetName);
  const graphs = await dataset.getGraphs().toArray();

  return Response.json({ graphs });
}

export async function POST(request: NextRequest) {
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

  let dpp: DPP;
    try {
      dpp = (await request.json()) as DPP;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

  try {
    const jsonLdPayload = await toJsonLdPayload(
      dpp as Record<string, unknown>,
      "dpp-core:DPP",
        getContext,
        transformNestedObjects
    );

    const uploadResult = await uploadToTriplyDB(jsonLdPayload, {
      token,
      datasetName,
      graphName,
    });

    return NextResponse.json({
      message:
        "DPP created, transformed to JSON-LD, and uploaded successfully.",
      dpp: dpp,
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
