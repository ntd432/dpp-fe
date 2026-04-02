"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { CollapsibleSection } from "@/components/form/CollapsibleSection";
import { useLanguage } from "@/contexts/LanguageContext";

type DppQrCardClientProps = Readonly<{
  dppId: string;
}>;

export default function DppQrCardClient({ dppId }: DppQrCardClientProps) {
  const { t } = useLanguage();
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
      setShareMessage(t("dppQr.share.noUrl"));
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
              text: t("dppQr.share.withQrText"),
              files: [qrFile],
              url: dppPageUrl,
            });
            setShareMessage(t("dppQr.share.qrShared"));
            return;
          }
        }

        await navigator.share({
          title: shareTitle,
          text: t("dppQr.share.openText"),
          url: dppPageUrl,
        });
        setShareMessage(t("dppQr.share.linkShared"));
        return;
      }

      await navigator.clipboard.writeText(dppPageUrl);
      setShareMessage(t("dppQr.share.copied"));
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(dppPageUrl);
        setShareMessage(t("dppQr.share.abortFallback"));
      } catch {
        setShareMessage(t("dppQr.share.manual"));
      }
    }
  }, [dppId, dppPageUrl, qrDataUrl, t]);

  return (
    <CollapsibleSection title={t("dppQr.title")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{t("dppQr.description")}</p>
          <p className="text-xs text-gray-500 break-all">{dppPageUrl || t("dppQr.preparing")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleShareQr()}
              className="px-4 py-2 text-sm rounded-lg bg-[var(--color-brand-pink)] text-white font-bold hover:brightness-110 hover:cursor-pointer"
            >
              {t("dppQr.share")}
            </button>
            {qrDataUrl && (
              <a
                href={qrDataUrl}
                download={`dpp-${dppId}.png`}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t("dppQr.download")}
              </a>
            )}
          </div>
          {shareMessage && <p className="text-xs text-gray-500">{shareMessage}</p>}
        </div>

        <div className="w-[280px] h-[280px] rounded-lg border border-gray-200 bg-white p-3 flex items-center justify-center">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt={t("dppQr.imageAlt")}
              width={256}
              height={256}
              className="w-full h-full"
            />
          ) : (
            <p className="text-xs text-gray-500 text-center">{t("dppQr.generating")}</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
