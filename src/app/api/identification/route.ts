import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { ProductIdentificationInformation } from "@/types/dpp-product-info";

export async function GET() {
  try {
    const data = await fetchFromAPI<ProductIdentificationInformation>("pii");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch identification data:", error);
    return NextResponse.json(
      { error: "Failed to fetch identification data" },
      { status: 500 }
    );
  }
}
