import { DPP } from "@/types";
import { getDPPById } from "@/services/dpp.service";
import DppDetailClient from "./DppDetailClient";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue | undefined;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyPayload(payload: JsonValue): boolean {
  if (payload === null) return true;
  if (typeof payload === "string") return payload.trim().length === 0;
  if (Array.isArray(payload)) return payload.length === 0;
  if (isObject(payload)) return Object.keys(payload).length === 0;
  return false;
}

export default async function DppDetailPage({
  params,
}: Readonly<{
  params: Promise<{ dppId: string }>;
}>) {
  const { dppId } = await params;

  if (!dppId) {
    return <DppDetailClient dppId="" errorKey="missingId" />;
  }

  let data: DPP | null = null;
  let errorKey: "notFound" | "unexpected" | "failed" | null = null;

  try {
    const payload = (await getDPPById(dppId)) as JsonValue;

    if (isEmptyPayload(payload)) {
      errorKey = "notFound";
      return <DppDetailClient dppId={dppId} errorKey={errorKey} />;
    }

    if (!isObject(payload)) {
      errorKey = "unexpected";
      return <DppDetailClient dppId={dppId} errorKey={errorKey} />;
    }

    data = payload as DPP;
  } catch (err) {
    errorKey = "failed";
  }

  return <DppDetailClient dppId={dppId} dppData={data} errorKey={errorKey} />;
}
