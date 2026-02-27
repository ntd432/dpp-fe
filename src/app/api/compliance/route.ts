import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { ComplianceInfo } from "@/types/product";

export async function GET() {
  try {
    const data = await fetchFromAPI<ComplianceInfo>("compliance");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch compliance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliance data" },
      { status: 500 }
    );
  }
}
