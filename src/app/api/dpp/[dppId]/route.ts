import { NextRequest, NextResponse } from "next/server";
import { transformToJsonFromDescribeResult } from "@/lib/triplydb-client";
import { describeSubjectFromTriplyDB } from "@/lib/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ dppId: string }> },
) {
  const { dppId } = await params;

  if (!dppId) {
    return NextResponse.json({ error: "Missing DPP ID" }, { status: 400 });
  }

  try {
    const describeResult = await describeSubjectFromTriplyDB(
      `urn:dpp:${dppId}`,
    );
    const dppData = await transformToJsonFromDescribeResult(describeResult);
    return NextResponse.json(dppData);
  } catch (error) {
    console.error("Failed to fetch DPP by ID:", error);
    return NextResponse.json({ error: "Failed to fetch DPP data" }, { status: 500 });
  }
}
