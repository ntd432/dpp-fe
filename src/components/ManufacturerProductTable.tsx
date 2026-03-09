"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Manufacturer {
  name: string;
  id: string;
  url: string;
}

interface Product {
  name: string;
  gtin: string;
  country: string;
  documentation: string;
  productionDate: string;
}

export default function ManufacturerProductTable() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch manufacturers on mount
  useEffect(() => {
    fetch("/api/manufacturers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load manufacturers");
        return res.json();
      })
      .then((data) => setManufacturers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingManufacturers(false));
  }, []);

  // Fetch products when manufacturer changes
  useEffect(() => {
    if (!selectedId) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/products?manufacturerId=${encodeURIComponent(selectedId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Products by Manufacturer
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a manufacturer to view their product information.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loadingManufacturers}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingManufacturers
                  ? "Loading manufacturers..."
                  : "-- Select a manufacturer --"}
              </option>
              {manufacturers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!selectedId && !error && (
        <div className="px-6 py-16 text-center text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-sm">
            Choose a manufacturer from the dropdown to display products.
          </p>
        </div>
      )}

      {loading && (
        <div className="px-6 py-16 text-center">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      )}

      {!loading && selectedId && products.length === 0 && !error && (
        <div className="px-6 py-16 text-center text-gray-400">
          <p className="text-sm">No products found for this manufacturer.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">GTIN</th>
                <th className="px-6 py-3">Country of Origin</th>
                <th className="px-6 py-3">Production Date</th>
                <th className="px-6 py-3">Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr
                  key={`${p.name}--${p.gtin}--${p.productionDate}--${p.country}--${p.documentation}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {p.gtin ? (
                      <Link
                        href={`/product/${encodeURIComponent(p.gtin)}`}
                        className="text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        {p.name || "—"}
                      </Link>
                    ) : (
                      p.name || "—"
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {p.gtin || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.country || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(p.productionDate).toLocaleDateString() || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {p.documentation ? (
                      <a
                        href={p.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
