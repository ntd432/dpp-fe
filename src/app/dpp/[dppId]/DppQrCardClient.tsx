"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { CollapsibleSection } from "@/components/form/CollapsibleSection";

type DppQrCardClientProps = Readonly<{
  dppId: string;
}>;

export default function DppQrCardClient({ dppId }: DppQrCardClientProps) {
  const [origin, setOrigin] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const dppPageUrl = useMemo(
    () => (dppId && origin ? `${origin}/dpp/${encodeURIComponent(dppId)}` : ""),
    [dppId, origin],
  );

  useEffect(() => {
    setOrigin(globalThis.location.origin);
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

    const shareTitle = `Digital Product Passport ${dppId}`.trim();

    try {
      if (navigator.share) {
        if (qrDataUrl) {
          const qrBlob = await fetch(qrDataUrl).then((res) => res.blob());
          const qrFile = new File([qrBlob], `dpp-${dppId}.png`, { type: "image/png" });

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

  return (
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
            {qrDataUrl && (
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
  );
}
