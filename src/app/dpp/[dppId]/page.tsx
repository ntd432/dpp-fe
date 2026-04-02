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
import { getDPPById } from "@/services/dpp.service";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/i18n/locale";
import { translate } from "@/i18n/translate";

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
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE_KEY)?.value);
  const t = (key: string) => translate(locale, key);

  const { dppId } = await params;


  if (!dppId) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage
          message={t("dppDetail.missingId")}
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

  let data: JsonObject | null = null;
  let error: string | null = null;

  try {
    const payload = (await getDPPById(dppId)) as JsonValue;

    if (isEmptyPayload(payload)) {
      throw new Error(t("dppDetail.notFound"));
    }

    if (!isObject(payload)) {
      throw new Error(t("dppDetail.unexpected"));
    }

    data = payload;
  } catch (err) {
    error = err instanceof Error ? err.message : t("dppDetail.failed");
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
              {t("dppDetail.backToView")}
            </Link>
          }
        />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={t("dppDetail.noData")} />
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
          {JSON.stringify(data, null, 2)}
        </pre>
      </CollapsibleSection>
    </main>
  );
}
