import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { Manufacturer } from "@/types/dpp-product-info";

export async function GET() {
  try {
    const data = await fetchFromAPI<Manufacturer>("all-manufacturers");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to fetch manufacturers" },
      { status: 500 }
    );
  }
}
