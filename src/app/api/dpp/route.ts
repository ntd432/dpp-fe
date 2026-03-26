import { NextRequest, NextResponse } from "next/server";
import { toJsonLdPayload, transformToJsonFromDescribeResult, TriplyUploadError, uploadToTriplyDB } from "@/lib/triplydb-client";
import type { DPP } from "@/types/dpp-core";
import { getContext, transformNestedObjects } from "@/lib/transforms-jsonld/dpp";
import { describeSubjectFromTriplyDB } from "@/lib/api";

export async function GET(request: NextRequest) {
  const dppId = request.nextUrl.searchParams.get("id");
  if (dppId) {
    try {
      const describeResult = await describeSubjectFromTriplyDB(`urn:dpp:${dppId}`);
      const dppData = await transformToJsonFromDescribeResult(describeResult);
      return NextResponse.json(dppData);
    } catch (error) {
      console.error("Failed to fetch DPP by ID:", error);
      return NextResponse.json(
        { error: "Failed to fetch DPP data" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Missing DPP ID. Use /api/dpp/{dppId} or /api/dpp?id={dppId}." },
      { status: 400 },
    );
  }

}

export async function POST(request: NextRequest) {
  const token = process.env.TRIPLYDB_TOKEN;
  const datasetName = process.env.DATASET_NAME;
  const companyName = process.env.COMPANY_NAME?.toLowerCase().replaceAll(" ", "-") || "example-manufacturer";
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
  dpp.id = `urn:dpp:generated:${dpp.dppRegistrationNumber}`;
  dpp.dataCarrier = `dpp/${dpp.dppRegistrationNumber}`;

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
