import App from "@triply/triplydb";
import { NextRequest, NextResponse } from "next/server";
import { toJsonLdPayload, TriplyUploadError, uploadToTriplyDB } from "@/lib/triplydb-client";
import type { DPP } from "@/types/dpp-core";
import { getContext, transformNestedObjects } from "@/lib/transforms/dpp";

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
  dpp.dppRegistrationNumber = crypto.randomUUID();
  dpp.id = `urn:dpp:${dpp.dppRegistrationNumber}`;
  dpp.dataCarrier = `${process.env.URL}/dpp/${dpp.id}`;

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
