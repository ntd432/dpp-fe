import { NextResponse } from "next/server";
import { TriplyDBClient } from "@/lib/triplydb-client";
import { Organization } from "@/types/dpp-core";

export async function GET() {
  try {
    const data = await TriplyDBClient.fetchFromAPI<Organization>("manufacturers", "3");
    const filteredData = filterManufacturers(data);
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Failed to fetch manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to fetch manufacturers" },
      { status: 500 }
    );
  }
}
