"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollapsibleSection } from "@/components/form/CollapsibleSection";
import { useLanguage } from "@/contexts/LanguageContext";

type ProductItem = {
  id: string;
  label: string;
  gtin: string;
  manufacturerName: string;
  manufacturerUrl: string;
  imageUrl: string | null;
};

const isValidUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

export default function ViewProductsClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setProductError(null);
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const products = await response.json();
        setProductList(products);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
        setProductError(errorMessage);
        console.error("Error fetching products:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    void fetchProducts();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => router.push("/")}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 hover:cursor-pointer"
      >
        {`← ${t("viewDpp.back")}`}
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("viewProducts.title")}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t("viewProducts.subtitle")}
        </p>
      </div>

      <CollapsibleSection title={t("viewProducts.productsSection")} defaultOpen>
        {isLoadingProducts ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t("viewProducts.loadingProducts")}</p>
          </div>
        ) : productError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("viewProducts.loadProductsError")} {productError}
          </div>
        ) : productList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t("viewProducts.noProductsFound")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">{t("viewProducts.gtinColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">{t("viewProducts.productNameColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">{t("viewProducts.manufacturerColumn")}</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">{t("viewProducts.imageColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm font-mono">{product.gtin}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{product.label}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {isValidUrl(product.manufacturerUrl) ? (
                        <a
                          href={product.manufacturerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-brand-pink)] hover:underline"
                        >
                          {product.manufacturerName}
                        </a>
                      ) : (
                        <span>{product.manufacturerName}</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {product.imageUrl && isValidUrl(product.imageUrl) ? (
                        <a
                          href={product.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.label}
                            className="h-20 w-20 object-cover rounded mx-auto"
                          />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">{t("viewProducts.noImage")}</span>
                      )}
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
