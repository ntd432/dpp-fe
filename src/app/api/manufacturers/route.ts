import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";
import { Organization } from "@/types/dpp-core";

export async function GET() {
  try {
    const data = await fetchFromAPI<Organization>("all-manufacturers");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to fetch manufacturers" },
      { status: 500 }
    );
  }
}
