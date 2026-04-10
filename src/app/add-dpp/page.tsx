import AddDppFormClient, {
  ManufacturerOption,
  ProductOption,
} from "./AddDppFormClient";
import { cookies, headers } from "next/headers";
import UnsupportedDevicePage from "@/components/UnsupportedDevicePage";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/i18n/locale";
import { TriplyDBClient } from "@/lib/triplydb-client";
import { isPhoneUserAgent } from "@/lib/device";
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
  const userAgent = (await headers()).get("user-agent") ?? "";

  if (isPhoneUserAgent(userAgent)) {
    return <UnsupportedDevicePage/>;
  }

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
