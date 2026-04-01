"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CollapsibleSection } from "@/components/form/CollapsibleSection";
import { DPPInformation } from "../groups/DPPInformationComponent";
import { DPP } from "@/types";
import { ProductInformationComponent } from "../groups/ProductInformationComponent";
import { ComplianceComponent } from "../groups/ComplianceComponent";
import { SustainabilityComponent } from "../groups/SustainabilityComponent";
import { EndOfLifeComponent } from "../groups/EndOfLifeComponent";
import { GuidelinesAndManualsComponent } from "../groups/GuidelinesAndManualsComponent";
import { SupplyChainComponent } from "../groups/SupplyChainComponent";
import { UsageComponent } from "../groups/UsageComponent";
import { TEST_DPP } from "../../../../next.config";


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

export default function DppDetailPage() {
  const params = useParams<{ dppId: string }>();
  const rawId = params?.dppId;
  const dppId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [data, setData] = useState<JsonObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const encodedId = useMemo(() => encodeURIComponent(dppId ?? ""), [dppId]);
  const dppPageUrl = useMemo(
    () => (dppId && origin ? `${origin}/dpp/${encodeURIComponent(dppId)}` : ""),
    [dppId, origin],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(globalThis.location.origin);
    }
  }, []);

  useEffect(() => {
    const buildQr = async () => {
      if (!dppPageUrl) {
        setQrDataUrl("");
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(dppPageUrl, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 280,
        });
        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl("");
      }
    };

    void buildQr();
  }, [dppPageUrl]);

  const handleShareQr = useCallback(async () => {
    if (!dppPageUrl) {
      setShareMessage("Unable to share: DPP URL is not available.");
      return;
    }

    const shareTitle = `Digital Product Passport ${dppId ?? ""}`.trim();

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        if (qrDataUrl) {
          const qrBlob = await fetch(qrDataUrl).then((res) => res.blob());
          const qrFile = new File([qrBlob], `dpp-${dppId ?? "qr"}.png`, { type: "image/png" });

          if (navigator.canShare?.({ files: [qrFile] })) {
            await navigator.share({
              title: shareTitle,
              text: "Scan this QR code to view the Digital Product Passport.",
              files: [qrFile],
              url: dppPageUrl,
            });
            setShareMessage("QR code shared.");
            return;
          }
        }

        await navigator.share({
          title: shareTitle,
          text: "Open this Digital Product Passport:",
          url: dppPageUrl,
        });
        setShareMessage("DPP link shared.");
        return;
      }

      await navigator.clipboard.writeText(dppPageUrl);
      setShareMessage("Sharing is unavailable in this browser. Link copied to clipboard.");
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(dppPageUrl);
        setShareMessage("Could not open share sheet. Link copied to clipboard.");
      } catch {
        setShareMessage("Unable to share automatically. Please copy the DPP link manually.");
      }
    }
  }, [dppId, dppPageUrl, qrDataUrl]);

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

      if (isEmptyPayload(payload)) {
        throw new Error("This DPP does not exist. Try another ID.");
      }

      if (!isObject(payload)) {
        throw new Error("Unexpected API response format.");
      }

      setData(payload);
      setData(TEST_DPP)
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage
          message={error}
          action={
            <Link
              href="/dpp"
              className="inline-flex px-4 py-2 bg-[var(--color-brand-pink)] text-white rounded-lg text-sm hover:bg-[var(--color-brand-pink-dark)] transition-colors"
            >
              Back to View DPP
            </Link>
          }
        />
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

      <CollapsibleSection title="DPP QR Code">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Scan or share this QR code to open this DPP page.</p>
            <p className="text-xs text-gray-500 break-all">{dppPageUrl || "Preparing URL..."}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleShareQr()}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--color-brand-pink)] text-white font-bold hover:brightness-110 hover:cursor-pointer"
              >
                Share QR
              </button>
              {qrDataUrl && dppId && (
                <a
                  href={qrDataUrl}
                  download={`dpp-${dppId}.png`}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Download QR
                </a>
              )}
            </div>
            {shareMessage && <p className="text-xs text-gray-500">{shareMessage}</p>}
          </div>

          <div className="w-[280px] h-[280px] rounded-lg border border-gray-200 bg-white p-3 flex items-center justify-center">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt="QR code linking to this DPP page"
                width={256}
                height={256}
                className="w-full h-full"
              />
            ) : (
              <p className="text-xs text-gray-500 text-center">Generating QR code...</p>
            )}
          </div>
        </div>
      </CollapsibleSection>

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
        <pre className="text-xs leading-5 overflow-x-auto rounded-lg border border-gray-200 bg-gray-900 text-gray-100 p-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CollapsibleSection>
    </main>
  );
}
