import { fetchFromAPI } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ErrorMessage from "@/components/ErrorMessage";
import { ProductIdentificationInformation } from "@/types/dpp-product-info";

export const dynamic = "force-dynamic";

export default async function IdentificationPage() {
  let data: ProductIdentificationInformation[] = [];
  let error: string | null = null;

  try {
    data = await fetchFromAPI<ProductIdentificationInformation>("pii");
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Failed to load identification data";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Product Identification
        </h1>
        <p className="text-gray-500 mt-1">
          Product names, serial numbers, GTINs, and other identification
          details.
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No identification data available.
        </p>
      ) : (
        <div className="space-y-6">
          {data.map((item, idx) => (
            <ProductCard
              key={idx}
              title={item.name || `Product ${idx + 1}`}
              data={{ ...item }}
              accentColor="blue"
            />
          ))}
        </div>
      )}
    </div>
  );
}
