"use client";

import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
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
import DppQrCardClient from "./DppQrCardClient";
import { useLanguage } from "@/contexts/LanguageContext";

type DppDetailErrorKey = "missingId" | "notFound" | "unexpected" | "failed" | "noData";

type DppDetailClientProps = Readonly<{
  dppId: string;
  dppData?: DPP | null;
  errorKey?: DppDetailErrorKey | null;
}>;

function ErrorScreen({ messageKey }: Readonly<{ messageKey: DppDetailErrorKey }>) {
  const { t } = useLanguage();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <ErrorMessage
        message={t(`dppDetail.${messageKey}`)}
        action={
          <Link
            href="/dpp"
            className="inline-flex px-4 py-2 bg-[var(--color-brand-pink)] text-white rounded-lg text-sm hover:bg-[var(--color-brand-pink-dark)] transition-colors"
          >
            {t("dppDetail.backToView")}
          </Link>
        }
      />
    </main>
  );
}

export default function DppDetailClient({ dppId, dppData, errorKey }: DppDetailClientProps) {
  const { t } = useLanguage();

  if (errorKey) {
    return <ErrorScreen messageKey={errorKey} />;
  }

  if (!dppData) {
    return <ErrorScreen messageKey="noData" />;
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{t("dppDetail.title")}</h1>
        </div>
        <Link
          href="/dpp"
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {t("dppDetail.backToView")}
        </Link>
      </div>
      <DppQrCardClient dppId={dppId} />

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

      <CollapsibleSection title={t("dppDetail.rawJson")} showCollapseButton defaultOpen={false}>
        <pre className="text-xs leading-5 overflow-x-auto rounded-lg border border-gray-200 bg-gray-900 text-gray-100 p-4">
          {JSON.stringify(dppData, null, 2)}
        </pre>
      </CollapsibleSection>
    </main>
  );
}