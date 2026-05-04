import AddProductFormClient from "./AddProductFormClient";
import { headers } from "next/headers";
import UnsupportedDevicePage from "@/components/UnsupportedDevicePage";
import { isPhoneUserAgent } from "@/lib/device";
import { ServerUtils } from "@/lib/ServerUtils";

export default async function AddProductPage() {
  const userAgent = (await headers()).get("user-agent") ?? "";

  if (isPhoneUserAgent(userAgent)) {
    return <UnsupportedDevicePage/>;
  }

  const manufacturers = await ServerUtils.loadManufacturers();

  return <AddProductFormClient initialManufacturers={manufacturers} />;
}
