import { TriplyDBClient } from "@/lib/triplydb-client";
import AddProductFormClient from "./AddProductFormClient";
import { cookies, headers } from "next/headers";
import UnsupportedDevicePage from "@/components/UnsupportedDevicePage";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/i18n/locale";
import { isPhoneUserAgent } from "@/lib/device";

interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

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

export default async function AddProductPage() {
  const userAgent = (await headers()).get("user-agent") ?? "";

  if (isPhoneUserAgent(userAgent)) {
    return <UnsupportedDevicePage/>;
  }

  const manufacturers = await loadManufacturers();

  return <AddProductFormClient initialManufacturers={manufacturers} />;
}
