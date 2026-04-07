import { TriplyDBClient } from "@/lib/triplydb-client";
import ProductCard from "@/components/ProductCard";
import ErrorMessage from "@/components/ErrorMessage";
import { ProductIdentificationInformation } from "@/types/dpp-product-info";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/i18n/locale";
import { translate } from "@/i18n/translate";

export const dynamic = "force-dynamic";

export default async function IdentificationPage() {
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE_KEY)?.value);
  const t = (key: string) => translate(locale, key);

  let data: ProductIdentificationInformation[] = [];
  let error: string | null = null;

  try {
    data = await TriplyDBClient.fetchFromAPI<ProductIdentificationInformation>("pii");
  } catch (e) {
    error =
      e instanceof Error ? e.message : t("identification.error");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("identification.title")}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("identification.subtitle")}
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          {t("identification.empty")}
        </p>
      ) : (
        <div className="space-y-6">
          {data.map((item, idx) => (
            <ProductCard
              key={item.gtin || item.taricCode || item.productName || `product-${idx}`}
              title={item.productName || `Product ${idx + 1}`}
              data={{ ...item }}
              accentColor="blue"
            />
          ))}
        </div>
      )}
    </div>
  );
}
