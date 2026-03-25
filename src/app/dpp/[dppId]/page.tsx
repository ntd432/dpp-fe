"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import { DPPInformation } from "../groups/DPPInformationComponent";
import { DPP } from "@/types";
import { ProductInformationComponent } from "../groups/ProductInformationComponent";
import { ComplianceComponent } from "../groups/ComplianceComponent";
import { SustainabilityComponent } from "../groups/SustainabilityComponent";
import { EndOfLifeComponent } from "../groups/EndOfLifeComponent";
import { GuidelinesAndManualsComponent } from "../groups/GuidelinesAndManualsComponent";
import { SupplyChainComponent } from "../groups/SupplyChainComponent";
import { UsageComponent } from "../groups/UsageComponent";


type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue | undefined;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

  const dppData = data as unknown as DPP;
  const supplyChain = dppData.supplyChain;
  const usage = dppData.usage;
  const product = dppData.product;
  const productInfo = product?.productInfo;
  const compliance = product?.compliance;
  const sustainability = product?.sustainability;
  const endOfLife = product?.endOfLife;
  const guidelines = product?.guidelines;

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

      <DPPInformation {...dppData} />

      {productInfo && (
        <ProductInformationComponent
          productInfo={productInfo}
          productSector={product?.productSector}
        />
      )}

      <SustainabilityComponent sustainability={sustainability} />

      <UsageComponent usage={usage} />

      <EndOfLifeComponent endOfLife={endOfLife} />

      <SupplyChainComponent supplyChain={supplyChain} />

      <GuidelinesAndManualsComponent guidelines={guidelines} />

      <ComplianceComponent compliance={compliance} />

      <CollapsibleSection title="Raw JSON" showCollapseButton defaultOpen={false}>
        <DataLayerGroup layer="Commercial">
          <pre className="text-xs leading-5 overflow-x-auto rounded-lg border border-gray-200 bg-gray-900 text-gray-100 p-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        </DataLayerGroup>
      </CollapsibleSection>
    </main>
  );
}
