import AddDppFormClient, { ProductOption } from "./AddDppFormClient";
import { headers } from "next/headers";
import UnsupportedDevicePage from "@/components/UnsupportedDevicePage";
import { TriplyDBClient } from "@/lib/triplydb-client";
import { isPhoneUserAgent } from "@/lib/device";
import { Product } from "@/types";
import { ServerUtils } from "@/lib/ServerUtils";



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
  const userAgent = (await headers()).get("user-agent") ?? "";

  if (isPhoneUserAgent(userAgent)) {
    return <UnsupportedDevicePage/>;
  }

  const [manufacturers, products] = await Promise.all([
    ServerUtils.loadManufacturers(),
    loadProducts(),
  ]);

  return (
    <AddDppFormClient
      initialManufacturers={manufacturers}
      initialProducts={products}
    />
  );
}
