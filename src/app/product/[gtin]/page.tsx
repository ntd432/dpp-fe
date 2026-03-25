"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface EventItem {
  [key: string]: string;
}

interface EnvironmentalImpactItem {
  impactCategory?: string;
  impactMethod?: string;
  impactFactor?: string;
  impactModel?: string;
  impactIndicatorValue?: string;
  impactIndicatorUnit?: string;
}

interface ProductData {
  // Identification
  dppLabel?: string;
  name?: string;
  gtin?: string;
  serial?: string;
  country?: string;
  documentation?: string;
  productionDate?: string;
  image?: string;
  // Manufacturer
  manufacturerName?: string;
  manufacturerUrl?: string;
  manufacturerId?: string;
  // Material
  materialComposition?: string;
  materialBills?: string;
  recycledReusedContent?: string;
  // Product info
  sparePartsAvailability?: string;
  hazSubName?: string;
  hazSubDesc?: string;
  substancesOfConcern?: string;
  productSpecification?: string;
  testReports?: string;
  assemblyProcess?: string;
  productionMethod?: string;
  lifetimeExpectancy?: string;
  qualityAssessment?: string;
  identifiedRisk?: string;
  // Compliance
  regulationName?: string;
  regulationId?: string;
  labelName?: string;
  productStatus?: string;
  productStatusDesc?: string;
  certName?: string;
  certDesc?: string;
  dmmName?: string;
  dmmDesc?: string;
  // Sustainability
  envFootprint?: string;
  resourceConsumption?: string;
  decomposability?: string;
  criticalRawMaterial?: string;
  lcaReport?: string;
  renewableContent?: string;
  labourConditions?: string;
  envDeclaration?: string;
  environmentalImpacts?: EnvironmentalImpactItem[];
  // End-of-life
  recyclingReusePotential?: string;
  disposalOptions?: string;
  expectedWaste?: string;
  reusability?: string;
  repairability?: string;
  refurbishability?: string;
  upgradeOptions?: string;
  numberOfLifecycles?: string;
  wastePrevention?: string;
  separateCollection?: string;
  collectionInfo?: string;
  eolReport?: string;
  // Guidelines
  assemblyGuideUrl?: string;
  disassemblyGuideUrl?: string;
  productManualUrl?: string;
  storageGuideUrl?: string;
  safetyUrl?: string;
  maintenanceUrl?: string;
  wasteSortingUrl?: string;
  accessibility?: string;
  utilizationCharacteristic?: string;
  // Usage (aggregated arrays)
  maintenanceEvents?: EventItem[];
  usageEvents?: EventItem[];
  incidentEvents?: EventItem[];
  [key: string]: unknown;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function Section({
  title,
  color,
  children,
}: Readonly<{
  title: string;
  color: string;
  children: React.ReactNode;
}>) {
  const borderColors: Record<string, string> = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    emerald: "border-emerald-500",
    amber: "border-amber-500",
    rose: "border-rose-500",
    cyan: "border-cyan-500",
    indigo: "border-indigo-500",
  };
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${
        borderColors[color] ?? "border-gray-400"
      } overflow-hidden`}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: Readonly<{ label: string; value?: string }>) {
  if (!value) return null;
  const isUrl = value.startsWith("http://") || value.startsWith("https://");
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
        {label}
      </span>
      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 underline break-all text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-900 text-sm leading-relaxed">{value}</span>
      )}
    </div>
  );
}

function EventTable({
  events,
  columns,
}: Readonly<{
  events: EventItem[];
  columns: { key: string; label: string }[];
}>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {events.map((e, i) => (
            <tr key={JSON.stringify(e) || String(i)} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2 text-gray-700">
                  {e[c.key] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams<{ gtin: string }>();
  const gtin = params.gtin;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gtin) return;

    fetch(`/api/products?gtin=${encodeURIComponent(gtin)}`)
      .then((res) => {
        if (res.status === 404)
          throw new Error("Product not found");
        if (!res.ok) throw new Error("Failed to load product");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [gtin]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading product information...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 inline-block">
          <p className="text-red-800 font-medium">{error || "Product not found"}</p>
          <Link
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const p = product;
  const hasSustainability = Boolean(
    p.envFootprint ||
      p.resourceConsumption ||
      p.decomposability ||
      p.criticalRawMaterial ||
      p.lcaReport ||
      p.renewableContent ||
      p.labourConditions ||
      p.envDeclaration ||
      (p.environmentalImpacts && p.environmentalImpacts.length > 0),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex items-start gap-6">
          {p.image && (
            <img
              src={p.image}
              alt={p.name || "Product"}
              className="w-24 h-24 rounded-xl object-cover border border-gray-200"
            />
          )}
          <div>
            <p className="text-sm text-gray-500">{p.dppLabel}</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {p.name || "Unknown Product"}
            </h1>
            {p.manufacturerName && (
              <p className="text-gray-500 mt-1">
                by{" "}
                {p.manufacturerUrl ? (
                  <a
                    href={p.manufacturerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline"
                  >
                    {p.manufacturerName}
                  </a>
                ) : (
                  p.manufacturerName
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Product Identification */}
        <Section title="Product Identification" color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="GTIN" value={p.gtin} />
            <Field label="Serial Number" value={p.serial} />
            <Field label="Country of Origin" value={p.country} />
            <Field label="Production Date" value={p.productionDate} />
            <Field label="Documentation" value={p.documentation} />
            <Field label="Lifetime Expectancy" value={p.lifetimeExpectancy} />
          </div>
        </Section>

        {/* 2. Material Information */}
        {(p.materialComposition || p.materialBills || p.recycledReusedContent) && (
          <Section title="Material Information" color="cyan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Material Composition" value={p.materialComposition} />
              <Field label="Bill of Materials" value={p.materialBills} />
              <Field label="Recycled / Reused Content" value={p.recycledReusedContent} />
              <Field label="Spare Parts Availability" value={p.sparePartsAvailability} />
              <Field label="Hazardous Substance" value={p.hazSubName} />
              <Field label="Hazardous Substance Details" value={p.hazSubDesc} />
              <Field label="Substances of Concern" value={p.substancesOfConcern} />
            </div>
          </Section>
        )}

        {/* 3. Specifications & Production */}
        {(p.productSpecification || p.assemblyProcess || p.productionMethod) && (
          <Section title="Specifications & Production" color="indigo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Product Specification" value={p.productSpecification} />
              <Field label="Assembly Process" value={p.assemblyProcess} />
              <Field label="Production Method" value={p.productionMethod} />
              <Field label="Test Reports" value={p.testReports} />
              <Field label="Quality Assessment" value={p.qualityAssessment} />
              <Field label="Identified Risk" value={p.identifiedRisk} />
            </div>
          </Section>
        )}

        {/* 4. Compliance */}
        {(p.regulationName || p.certName || p.labelName) && (
          <Section title="Compliance" color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Regulation" value={p.regulationName} />
              <Field label="Regulation ID" value={p.regulationId} />
              <Field label="Label" value={p.labelName} />
              <Field label="Product Status" value={p.productStatus} />
              <Field label="Status Description" value={p.productStatusDesc} />
              <Field label="Certification" value={p.certName} />
              <Field label="Certification Details" value={p.certDesc} />
              <Field label="Data Management Method" value={p.dmmName} />
              <Field label="DMM Details" value={p.dmmDesc} />
            </div>
          </Section>
        )}

        {/* 6. Sustainability */}
        {hasSustainability && (
          <Section title="Sustainability" color="emerald">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Environmental Footprint" value={p.envFootprint} />
                <Field label="Resource Consumption" value={p.resourceConsumption} />
                <Field label="Decomposability" value={p.decomposability} />
                <Field label="Critical Raw Material" value={p.criticalRawMaterial} />
                <Field label="LCA Report" value={p.lcaReport} />
                <Field label="Renewable Content" value={p.renewableContent} />
                <Field label="Labour Conditions" value={p.labourConditions} />
                <Field label="Environmental Declaration" value={p.envDeclaration} />
              </div>
              {p.environmentalImpacts && p.environmentalImpacts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Environmental Impacts
                  </h3>
                  <EventTable
                    events={p.environmentalImpacts as EventItem[]}
                    columns={[
                      { key: "impactCategory", label: "Category" },
                      { key: "impactMethod", label: "Method" },
                      { key: "impactFactor", label: "Factor" },
                      { key: "impactModel", label: "Model" },
                      { key: "impactIndicatorValue", label: "Indicator Value" },
                      { key: "impactIndicatorUnit", label: "Indicator Unit" },
                    ]}
                  />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* 7. End of Life */}
        {(p.recyclingReusePotential || p.disposalOptions || p.repairability) && (
          <Section title="End of Life" color="rose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Recycling / Reuse Potential" value={p.recyclingReusePotential} />
              <Field label="Disposal Options" value={p.disposalOptions} />
              <Field label="Expected Waste" value={p.expectedWaste} />
              <Field label="Reusability" value={p.reusability} />
              <Field label="Repairability" value={p.repairability} />
              <Field label="Refurbishability" value={p.refurbishability} />
              <Field label="Upgrade Options" value={p.upgradeOptions} />
              <Field label="Number of Lifecycles" value={p.numberOfLifecycles} />
              <Field label="Waste Prevention" value={p.wastePrevention} />
              <Field label="Separate Collection" value={p.separateCollection} />
              <Field label="Collection Info" value={p.collectionInfo} />
              <Field label="End of Life Report" value={p.eolReport} />
            </div>
          </Section>
        )}

        {/* 8. Guidelines & Manuals */}
        {(p.assemblyGuideUrl || p.productManualUrl || p.accessibility) && (
          <Section title="Guidelines & Manuals" color="cyan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Assembly Guide" value={p.assemblyGuideUrl} />
              <Field label="Disassembly Guide" value={p.disassemblyGuideUrl} />
              <Field label="Product Manual" value={p.productManualUrl} />
              <Field label="Storage Guide" value={p.storageGuideUrl} />
              <Field label="Safety Instructions" value={p.safetyUrl} />
              <Field label="Maintenance Instructions" value={p.maintenanceUrl} />
              <Field label="Waste Sorting" value={p.wasteSortingUrl} />
              <Field label="Accessibility" value={p.accessibility} />
              <Field label="Utilization Characteristic" value={p.utilizationCharacteristic} />
            </div>
          </Section>
        )}

        {/* 9. Usage */}
        {(p.maintenanceEvents || p.usageEvents || p.incidentEvents) && (
          <Section title="Usage Information" color="indigo">
            <div className="space-y-4">
              {p.maintenanceEvents && p.maintenanceEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Maintenance Log
                  </h3>
                  <EventTable
                    events={p.maintenanceEvents}
                    columns={[
                      { key: "maintActionName", label: "Action" },
                      { key: "maintTime", label: "Time" },
                    ]}
                  />
                </div>
              )}
              {p.usageEvents && p.usageEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Usage History
                  </h3>
                  <EventTable
                    events={p.usageEvents}
                    columns={[
                      { key: "usageActionName", label: "Action" },
                      { key: "usageTime", label: "Time" },
                    ]}
                  />
                </div>
              )}
              {p.incidentEvents && p.incidentEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Incidents & Errors
                  </h3>
                  <EventTable
                    events={p.incidentEvents}
                    columns={[
                      { key: "incidentActionName", label: "Incident" },
                      { key: "incidentTime", label: "Time" },
                    ]}
                  />
                </div>
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
