"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";

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

export default function ViewDppPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

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

  const goToDpp = (raw: string) => {
    const dppId = extractDppId(raw);

    if (!dppId) {
      setError("Please enter or scan a valid DPP ID.");
      return;
    }

    setError(null);
    router.push(`/dpp/${encodeURIComponent(dppId)}`);
  };

  const handleScan = async () => {
    if (!detector) {
      setError("QR scanner is not supported in this browser. Please enter the DPP ID manually.");
      return;
    }

    const mediaDevices = (navigator as unknown as { mediaDevices?: MediaDevicesLike }).mediaDevices;
    if (!mediaDevices?.getUserMedia) {
      setError("Camera access is not available in this browser.");
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
      setError("Unable to access camera. Check browser permissions and try again.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">View Digital Product Passport</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter a DPP ID or scan a QR code to open the DPP details page.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CollapsibleSection title="Find DPP" color="indigo" defaultOpen>
        <DataLayerGroup layer="Regulatory">
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <FormField
              label="DPP ID or Data Carrier"
              value={inputValue}
              onChange={setInputValue}
              placeholder="e.g. f9d15150-50c8-4ae3-b1f6-3c283e1d89fa or dpp/<id>"
              required
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToDpp(inputValue)}
                className="px-5 py-2 rounded-lg bg-[var(--color-brand-pink)] text-white text-sm font-semibold hover:brightness-110 hover:cursor-pointer"
              >
                View DPP
              </button>
              <button
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
                {isScanning ? "Stop Scanning" : "Scan QR Code"}
              </button>
            </div>
            {!isScannerAvailable && (
              <p className="text-xs text-gray-500">
                QR scanning is unavailable in this browser. Manual input still works.
              </p>
            )}
          </div>
        </DataLayerGroup>
      </CollapsibleSection>

      {isScanning && (
        <CollapsibleSection title="Camera Scanner" color="amber" defaultOpen>
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
    </main>
  );
}
