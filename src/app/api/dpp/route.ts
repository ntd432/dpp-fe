import { NextRequest, NextResponse } from "next/server";
import { toJsonLdPayload, transformToJsonFromDescribeResult, TriplyDBClient, TriplyUploadError } from "@/lib/triplydb-client";
import type { DPP } from "@/types/dpp-core";
import { getContext, transformNestedObjects } from "@/lib/transforms-jsonld/dpp";

export async function GET(request: NextRequest) {
  const dppId = request.nextUrl.searchParams.get("id");
  if (dppId) {
    try {
      const describeResult = await TriplyDBClient.describeSubjectFromTriplyDB(`urn:dpp:${dppId}`);
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
  const companyName = process.env.COMPANY_NAME?.toLowerCase().replaceAll(" ", "-") || "example-manufacturer";
  const graphName = `urn:dpp:data:${companyName}`;

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

    const uploadResult = await TriplyDBClient.uploadToTriplyDB(jsonLdPayload, graphName);

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
