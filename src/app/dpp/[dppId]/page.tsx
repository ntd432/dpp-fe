"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";
import InfoCard from "@/components/InfoCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import { DPPInformation } from "../groups/DPPInformation";

const IGNORE_LIST = [ "type" ]; // Keys to ignore in the display tree, can be extended as needed.

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue | undefined;
};

function prettyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function toDisplayString(value: string | number | boolean | null): string {
  if (value === null) return "null";
  return String(value);
}

function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function ValueTree({ label, value }: Readonly<{ label: string; value: JsonValue | undefined }>) {
  if (value === undefined) return null;

  if (IGNORE_LIST.includes(label.toLowerCase())) return null;

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <InfoCard label={prettyLabel(label)} value={toDisplayString(value)} />;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <InfoCard label={prettyLabel(label)} value="No data" />;

    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{prettyLabel(label)}</p>
        <div className="space-y-3 border border-gray-200 rounded-lg">
        {value.map((item, index) => (
          <div key={`${label}-${index}`} className="rounded-lg bg-white p-3">
            <ValueTree label={`${label} ${index + 1}`} value={item} />
          </div>
        ))}
        </div>
      </div>
    );
  }

  const entries = Object.entries(value).filter(([, nestedValue]) => nestedValue !== undefined);
  if (entries.length === 0) return <InfoCard label={prettyLabel(label)} value="No data" />;

  return (
    <details open className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <summary className="list-none cursor-pointer px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {prettyLabel(label)}
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="space-y-3 px-4 py-3">
        {entries.map(([childKey, childValue]) => (
          <ValueTree key={`${label}-${childKey}`} label={childKey} value={childValue} />
        ))}
      </div>
    </details>
  );
}

export default function DppDetailPage() {
  const params = useParams<{ dppId: string }>();
  const rawId = params?.dppId;
  const dppId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [data, setData] = useState<JsonObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const encodedId = useMemo(() => encodeURIComponent(dppId ?? ""), [dppId]);

  const fetchDpp = useCallback(async () => {
    if (!dppId) {
      setError("Missing DPP ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dpp/${encodedId}`);
      const payload = (await response.json()) as JsonValue;

      if (!response.ok) {
        if (isObject(payload) && typeof payload.error === "string") {
          throw new Error(payload.error);
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (!isObject(payload)) {
        throw new Error("Unexpected API response format.");
      }

      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load DPP data.");
    } finally {
      setLoading(false);
    }
  }, [dppId, encodedId]);

  useEffect(() => {
    void fetchDpp();
  }, [fetchDpp]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Link href="/dpp" className="text-sm text-gray-600 hover:text-gray-900 underline">
          Back to View DPP
        </Link>
        <ErrorMessage message={error} onRetry={() => void fetchDpp()} />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message="No DPP data returned." />
      </main>
    );
  }

  const supplyChain = data.supplyChain;
  const usage = data.usage;
  const product = data.product;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Product Passport</h1>
        </div>
        <Link
          href="/dpp"
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back to View DPP
        </Link>
      </div>

      <DPPInformation {...(data as any)} />

      <CollapsibleSection title="Supply Chain and Usage" color="amber" showCollapseButton defaultOpen={false}>
        <DataLayerGroup layer="Regulatory">
          <ValueTree label="supplyChain" value={supplyChain} />
        </DataLayerGroup>
        <DataLayerGroup layer="Downstream Data">
          <ValueTree label="usage" value={usage} />
        </DataLayerGroup>
      </CollapsibleSection>

      <CollapsibleSection title="Product Data" color="emerald" showCollapseButton defaultOpen={false}>
        <DataLayerGroup layer="Regulatory">
          <ValueTree label="product" value={product} />
        </DataLayerGroup>
      </CollapsibleSection>

      <CollapsibleSection title="Raw JSON" color="cyan" showCollapseButton defaultOpen={false}>
        <DataLayerGroup layer="Commercial">
          <pre className="text-xs leading-5 overflow-x-auto rounded-lg border border-gray-200 bg-gray-900 text-gray-100 p-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        </DataLayerGroup>
      </CollapsibleSection>
    </main>
  );
}
