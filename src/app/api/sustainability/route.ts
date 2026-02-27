import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { SustainabilityInfo } from "@/types/product";

export async function GET() {
  try {
    const data = await fetchFromAPI<SustainabilityInfo>("sustainability");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch sustainability data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sustainability data" },
      { status: 500 }
    );
  }
}
