import AddDppFormClient, {
  ManufacturerOption,
  ProductOption,
} from "./AddDppFormClient";
import { TriplyDBClient } from "@/lib/triplydb-client";
import { Product } from "@/types";

async function loadManufacturers(): Promise<ManufacturerOption[]> {
  try {
    const data = await TriplyDBClient.fetchFromAPI<ManufacturerOption>("manufacturers", "2");
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

async function loadProducts(): Promise<ProductOption[]> {
  try {
    const data = await TriplyDBClient.fetchFromAPI<Product>("products");
    return data
      .filter((p) => p.id)
      .map((p) => ({
        id: p.id,
        label: p.label ?? p.productInfo?.identification?.productName ?? p.id,
      }));
  } catch {
    return [];
  }
}

export default async function AddDppPage() {
  const [manufacturers, products] = await Promise.all([
    loadManufacturers(),
    loadProducts(),
  ]);

  return (
    <AddDppFormClient
      initialManufacturers={manufacturers}
      initialProducts={products}
    />
  );
}
