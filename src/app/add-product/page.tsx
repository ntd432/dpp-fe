import { fetchFromAPI } from "@/lib/api";
import AddProductFormClient from "./AddProductFormClient";

interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

async function loadManufacturers(): Promise<ManufacturerOption[]> {
  try {
    const data = await fetchFromAPI<ManufacturerOption>("manufacturers", "2");
    return data
      .filter((m) => m.id || m.name)
      .map((m) => ({
        id: m.id,
        name: m.name,
        url: m.url,
        identifier: m.identifier,
      }));
  } catch {
    return [];
  }
}

export default async function AddProductPage() {
  const manufacturers = await loadManufacturers();

  return <AddProductFormClient initialManufacturers={manufacturers} />;
}
