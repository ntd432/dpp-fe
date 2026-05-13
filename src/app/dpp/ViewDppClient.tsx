"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import { useLanguage } from "@/contexts/LanguageContext";

type BarcodeLike = {
  rawValue?: string;
};

type BarcodeDetectorCtor = new (options?: {
  formats?: string[];
}) => {
  detect: (source: HTMLVideoElement) => Promise<BarcodeLike[]>;
};

type MediaDevicesLike = {
  getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
};

type DppItem = {
  id: string;
  name: string;
  granularity: string;
  serial: string;
  batch: string;
};

const SCAN_FORMATS = ["qr_code"];

function extractDppId(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return value;
  }

  if (value.startsWith("urn:")) {
    const parts = value.split(":").filter(Boolean);
    return parts.at(-1) || "";
  }

  const dppSegment = /\/dpp\/([^/?#]+)/i.exec(value);
  if (dppSegment?.[1]) {
    return dppSegment[1];
  }

  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    const idx = segments.findIndex((segment) => segment.toLowerCase() === "dpp");
    if (idx >= 0 && segments[idx + 1]) {
      return segments[idx + 1];
    }
  } catch {
    // Not a URL; continue with generic normalization.
  }

  return value.replace(/^dpp\//i, "").replace(/^\/dpp\//i, "").trim();
}

export default function ViewDppClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dppList, setDppList] = useState<DppItem[]>([]);
  const [isLoadingDpps, setIsLoadingDpps] = useState(false);
  const [dppError, setDppError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const detector = useMemo(() => {
    const Detector = (globalThis as unknown as { BarcodeDetector?: BarcodeDetectorCtor })
      .BarcodeDetector;

    if (!Detector) return null;

    try {
      return new Detector({ formats: SCAN_FORMATS });
    } catch {
      return new Detector();
    }
  }, []);

  const isScannerAvailable = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const mediaDevices = (navigator as unknown as { mediaDevices?: MediaDevicesLike }).mediaDevices;
    return Boolean(detector && mediaDevices?.getUserMedia);
  }, [detector]);

  const stopScan = () => {
    if (rafRef.current !== null) {
      globalThis.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);

  useEffect(() => {
    const fetchDpps = async () => {
      setIsLoadingDpps(true);
      setDppError(null);
      try {
        const response = await fetch("/api/dpp?all=true");
        if (!response.ok) {
          throw new Error(`Failed to fetch DPPs: ${response.statusText}`);
        }
        const dpps = await response.json();
        setDppList(dpps);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch DPPs";
        setDppError(errorMessage);
        console.error("Error fetching DPPs:", err);
      } finally {
        setIsLoadingDpps(false);
      }
    };

    void fetchDpps();
  }, []);

  const goToDpp = (raw: string) => {
    const dppId = extractDppId(raw);

    if (!dppId) {
      setError(t("viewDpp.invalidId"));
      return;
    }

    setError(null);
    router.push(`/dpp/${encodeURIComponent(dppId)}`);
  };

  const handleScan = async () => {
    if (!detector) {
      setError(t("viewDpp.scannerUnsupported"));
      return;
    }

    const mediaDevices = (navigator as unknown as { mediaDevices?: MediaDevicesLike }).mediaDevices;
    if (!mediaDevices?.getUserMedia) {
      setError(t("viewDpp.cameraUnavailable"));
      return;
    }

    setError(null);

    try {
      const stream = await mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const tick = async () => {
        const video = videoRef.current;
        if (!video || !detector) return;

        try {
          const barcodes = await detector.detect(video);
          const rawValue = barcodes[0]?.rawValue;

          if (rawValue) {
            setInputValue(rawValue);
            stopScan();
            goToDpp(rawValue);
            return;
          }
        } catch {
          // Ignore intermittent detect errors while camera stream warms up.
        }

        rafRef.current = globalThis.requestAnimationFrame(() => {
          void tick();
        });
      };

      rafRef.current = globalThis.requestAnimationFrame(() => {
        void tick();
      });
    } catch {
      stopScan();
      setError(t("viewDpp.cameraError"));
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => router.push("/")}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 hover:cursor-pointer"
      >
        {`← ${t("viewDpp.back")}`}
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("viewDpp.title")}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t("viewDpp.subtitle")}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CollapsibleSection title={t("viewDpp.findSection")} defaultOpen>
        <FormField
          label={t("viewDpp.inputLabel")}
          value={inputValue}
          onChange={setInputValue}
          placeholder={t("viewDpp.inputPlaceholder")}
          required
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => goToDpp(inputValue)}
            className="px-5 py-2 rounded-lg bg-[var(--color-brand-pink)] text-white text-sm font-semibold hover:brightness-110 hover:cursor-pointer"
          >
            {t("viewDpp.viewButton")}
          </button>
          {/* <button
            type="button"
            onClick={() => {
              if (isScanning) {
                stopScan();
                return;
              }
              void handleScan();
            }}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
            disabled={!isScannerAvailable && !isScanning}
          >
            {isScanning ? t("viewDpp.stopScan") : t("viewDpp.scanButton")}
          </button> */}
        </div>
        {!isScannerAvailable && (
          <p className="text-xs text-gray-500">
            {t("viewDpp.scanUnavailable")}
          </p>
        )}
      </CollapsibleSection>

      {isScanning && (
        <CollapsibleSection title={t("viewDpp.cameraSection")} defaultOpen>
          <DataLayerGroup layer="Commercial">
            <div className="rounded-lg border border-gray-200 bg-black p-2">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-md"
                muted
                playsInline
                autoPlay
              />
            </div>
          </DataLayerGroup>
        </CollapsibleSection>
      )}

      <CollapsibleSection title={t("viewDpp.registeredSection")} defaultOpen>
        {isLoadingDpps ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t("viewDpp.loadingDpps")}</p>
          </div>
        ) : dppError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("viewDpp.loadDppsError")} {dppError}
          </div>
        ) : dppList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t("viewDpp.noDppsFound")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{t("viewDpp.idColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{t("viewDpp.productNameColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{t("viewDpp.granularityColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{t("viewDpp.serialColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{t("viewDpp.batchColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">{t("viewDpp.actionColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {dppList.map((dpp) => (
                  <tr key={dpp.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm font-mono">{dpp.id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{dpp.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{dpp.granularity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{dpp.serial}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{dpp.batch}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => goToDpp(dpp.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-brand-pink)] text-white text-xs font-semibold hover:brightness-110 hover:cursor-pointer"
                      >
                        {t("viewDpp.viewAction")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CollapsibleSection>
    </main>
  );
}
