import { fetchFromAPI } from "@/lib/api";
import { ComplianceInfo } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ErrorMessage from "@/components/ErrorMessage";

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  let data: ComplianceInfo[] = [];
  let error: string | null = null;

  try {
    data = await fetchFromAPI<ComplianceInfo>("compliance");
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load compliance data";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Compliance Information
        </h1>
        <p className="text-gray-500 mt-1">
          Regulations, certifications, labels, and data management methods for
          each product.
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No compliance data available.
        </p>
      ) : (
        <div className="space-y-6">
          {data.map((item, idx) => (
            <ProductCard
              key={idx}
              title={item.productName || `Product ${idx + 1}`}
              data={item}
              accentColor="purple"
            />
          ))}
        </div>
      )}
    </div>
  );
}
