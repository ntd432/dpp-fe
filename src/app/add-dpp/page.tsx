"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import { SECTORS } from "@/config/sectors";
import { AddEntryButton } from "@/components/form/AddEntryButton";

// ── Constants ────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full";

const GRANULARITY_OPTIONS = ["model", "batch", "item"] as const;
const DATA_CARRIER_FORMAT_OPTIONS = ["QR code", "NFC", "RFID", "DataMatrix"] as const;

// ── Generic array helpers ──────────────────────────────────────────────────

let nextId = 1;
function uid(): string {
  return `item-${nextId++}`;
}

function updateAt<T extends { _key: string }>(
  items: T[],
  index: number,
  field: keyof T,
  value: T[keyof T],
  onChange: (items: T[]) => void,
) {
  const next = [...items];
  next[index] = { ...next[index], [field]: value };
  onChange(next);
}

function removeAt<T>(items: T[], index: number, onChange: (items: T[]) => void) {
  onChange(items.filter((_, j) => j !== index));
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

interface ProductOption {
  id?: string;
  label?: string;
}

interface EventEntry {
  _key: string;
  actionName: string;
  actionType: string;
  time: string;
  locationName: string;
  actorName: string;
}

const emptyEvent = (): EventEntry => ({
  _key: uid(),
  actionName: "",
  actionType: "",
  time: "",
  locationName: "",
  actorName: "",
});

function EventArrayEditor({
  label,
  events,
  onChange,
}: Readonly<{
  label: string;
  events: EventEntry[];
  onChange: (events: EventEntry[]) => void;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label="+ Add Entry" onClick={() => onChange([...events, emptyEvent()])} />
      </div>
      {events.map((ev, i) => (
        <div key={ev._key} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Action name"
              value={ev.actionName}
              onChange={(e) => updateAt(events, i, "actionName", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="datetime-local"
              value={ev.time}
              onChange={(e) => updateAt(events, i, "time", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Action type"
              value={ev.actionType}
              onChange={(e) => updateAt(events, i, "actionType", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Location name"
              value={ev.locationName}
              onChange={(e) => updateAt(events, i, "locationName", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder="Actor name"
              value={ev.actorName}
              onChange={(e) => updateAt(events, i, "actorName", e.target.value, onChange)}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={() => removeAt(events, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

interface FormState {
  dppRegistrationNumber: string;
  productBatchNumber: string;
  productSerialNumber: string;
  granularity: string;
  dataCarrierFormat: string;
  productSector: string;
  // Issuer fields
  issuerMode: "existing" | "new";
  issuerId: string;
  issuerName: string;
  issuerUrl: string;
  // Linked product
  productId: string;
  // Supply chain
  traceabilityEvents: EventEntry[];
  recyclingPartnerName: string;
  customerReturnChannelName: string;
  componentSupplierName: string;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AddDppPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    dppRegistrationNumber: "",
    productBatchNumber: "",
    productSerialNumber: "",
    granularity: "",
    dataCarrierFormat: "",
    productSector: "",
    issuerMode: "existing",
    issuerId: "",
    issuerName: "",
    issuerUrl: "",
    productId: "",
    traceabilityEvents: [],
    recyclingPartnerName: "",
    customerReturnChannelName: "",
    componentSupplierName: "",
  });

  const [manufacturers, setManufacturers] = useState<ManufacturerOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load existing manufacturers
  useEffect(() => {
    const loadManufacturers = async () => {
      try {
        const res = await fetch("/api/manufacturers");
        if (!res.ok) return;
        const data = (await res.json()) as ManufacturerOption[];
        const normalized = data.filter((m) => m.id || m.name);
        setManufacturers(normalized);
      } catch {
        // Non-critical — user can still type a new manufacturer
      }
    };
    void loadManufacturers();
  }, []);

  // Load products for the linked-product dropdown
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) return;
        const data = (await res.json()) as ProductOption[];
        setProducts(data.filter((p) => p.id));
      } catch {
        // Non-critical
      }
    };
    void loadProducts();
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function validateRequiredFields(): string[] {
    const errors: string[] = [];

    if (!form.productBatchNumber.trim()) errors.push("Batch Number is required.");
    if (!form.productSerialNumber.trim()) errors.push("Serial Number is required.");
    if (!form.granularity) errors.push("DPP Granularity is required.");
    if (!form.dataCarrierFormat) errors.push("Data Carrier Format is required.");

    if (form.issuerMode === "existing" && !form.issuerId) {
      errors.push("DPP Issuer is required.");
    }

    if (form.issuerMode === "new" && !form.issuerName.trim()) {
      errors.push("Organisation Name is required when adding a new issuer.");
    }

    if (!form.productId) errors.push("Linked Product is required.");

    return errors;
  }

  // ── Build payload ─────────────────────────────────────────────────────────

  function buildIssuer(): Record<string, unknown> | undefined {
    if (form.issuerMode === "existing" && form.issuerId) {
      return { id: form.issuerId };
    }
    if (form.issuerMode === "new") {
      const issuer: Record<string, unknown> = {};
      if (form.issuerName) issuer.name = form.issuerName;
      if (form.issuerUrl) issuer.url = form.issuerUrl;
      return Object.keys(issuer).length > 0 ? issuer : undefined;
    }
    return undefined;
  }

  function buildPayload(): Record<string, unknown> {
    const formatTime = (t: string) => (t ? `${t}:00Z` : "");
    const buildEvents = (events: EventEntry[]) =>
      events.map((e) => {
        const ev: Record<string, unknown> = {};
        if (e.actionName) ev.actionName = e.actionName;
        if (e.actionType) ev.actionType = e.actionType;
        if (e.time) ev.time = formatTime(e.time);
        if (e.locationName) ev.location = { name: e.locationName };
        if (e.actorName) ev.actor = { name: e.actorName };
        return ev;
      });

    const dpp: Record<string, unknown> = {
      dppRegistrationNumber: form.dppRegistrationNumber,
    };

    if (form.productBatchNumber) dpp.productBatchNumber = form.productBatchNumber;
    if (form.productSerialNumber) dpp.productSerialNumber = form.productSerialNumber;
    if (form.granularity) dpp.granularity = form.granularity;
    if (form.dataCarrierFormat) dpp.dataCarrierFormat = form.dataCarrierFormat;
    dpp.dataCarrier = `${globalThis.location.origin}/dpp/${form.dppRegistrationNumber}`;
    if (form.productSector) dpp.productSector = form.productSector;

    const issuer = buildIssuer();
    if (issuer) dpp.issuer = issuer;
    if (form.productId) dpp.product = { id: form.productId };
    dpp.supplyChain = {
      productTraceability: {
        traceabilityEvent: buildEvents(form.traceabilityEvents),
      },
      recyclingPartner: { name: form.recyclingPartnerName },
      customerReturnChannel: { name: form.customerReturnChannelName },
      componentSupplier: { name: form.componentSupplierName },
    };

    return dpp;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationErrors = validateRequiredFields();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildPayload();
      const res = await fetch("/api/dpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Request failed with status ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 hover:cursor-pointer"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Register Digital Product Passport</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new DPP record. A registration number is auto-generated. Link
          it to an existing product or leave blank to create a standalone record.
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          DPP registered successfully! Redirecting…
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <CollapsibleSection title="Digital Product Passport Information" color="indigo" defaultOpen>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Batch Number"
                    value={form.productBatchNumber}
                    onChange={(v) => set("productBatchNumber", v)}
                    placeholder="e.g. BATCH-2025-001"
                    required
                />
                <FormField
                    label="Serial Number"
                    value={form.productSerialNumber}
                    onChange={(v) => set("productSerialNumber", v)}
                    placeholder="e.g. SN-00123456"
                    required
                />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="granularity" className="block text-sm font-medium text-gray-700 mb-1">
                    DPP Granularity
                    </label>
                    <select
                    id="granularity"
                    value={form.granularity}
                    onChange={(e) => set("granularity", e.target.value)}
                    className={INPUT_CLASS}
                    required
                    >
                    <option value="">Select granularity</option>
                    {GRANULARITY_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                <label htmlFor="dataCarrierFormat" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Carrier Format
                </label>
                <select
                    id="dataCarrierFormat"
                    value={form.dataCarrierFormat}
                    onChange={(e) => set("dataCarrierFormat", e.target.value)}
                    className={INPUT_CLASS}
                    required
                >
                    <option value="">Select format</option>
                    {DATA_CARRIER_FORMAT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                        {f}
                    </option>
                    ))}
                </select>
                </div>
                </div>

                <div>
                <label htmlFor="issuer-select" className="block text-sm font-medium text-gray-700 mb-1">
                    DPP Issuer
                </label>
                <select
                    id="issuer-select"
                    value={form.issuerMode === "new" ? "__new__" : form.issuerId}
                    onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__new__") {
                        set("issuerMode", "new");
                        set("issuerId", "");
                    } else {
                        const selected = manufacturers.find((m) => m.id === val);
                        set("issuerMode", "existing");
                        set("issuerId", val);
                        set("issuerName", selected?.name ?? "");
                        set("issuerUrl", selected?.url ?? "");
                    }
                    }}
                    className={INPUT_CLASS}
                    required
                >
                    <option value="">Select an organisation</option>
                    {manufacturers.map((m) => (
                    <option key={m.id} value={m.id ?? ""}>
                        {m.name ?? m.id}
                    </option>
                    ))}
                    <option value="__new__">+ Add a new organisation</option>
                </select>
                </div>

                {form.issuerMode === "new" && (
                <div className="grid grid-cols-2 gap-4 border-l-2 border-emerald-200 pl-3">
                    <FormField
                    label="Organisation Name"
                    value={""}
                    onChange={(v) => set("issuerName", v)}
                    placeholder="e.g. Acme Corp"
                    required
                    />
                    <FormField
                    label="Website URL"
                    value={""}
                    onChange={(v) => set("issuerUrl", v)}
                    type="url"
                    placeholder="https://example.com"
                    />
                </div>
                )}

                <div>
                <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Linked Product to this DPP
                </label>
                <select
                    id="product-select"
                    value={form.productId}
                    onChange={(e) => set("productId", e.target.value)}
                    className={INPUT_CLASS}
                    required
                >
                    <option value="">— None —</option>
                    {products.map((p) => (
                    <option key={p.id} value={p.id ?? ""}>
                        {p.label ?? p.id}
                    </option>
                    ))}
                </select>
                </div>
        </CollapsibleSection>
        

        <CollapsibleSection title="Product Supply Chain Information" color="amber" defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Product Traceability
              </legend>
              <EventArrayEditor
                label="Traceability Events"
                events={form.traceabilityEvents}
                onChange={(v) => set("traceabilityEvents", v)}
              />
            </fieldset>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <fieldset className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <legend className="text-sm font-semibold text-gray-800">
                Supply Chain Partners
              </legend>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Recycling Partner"
                  value={form.recyclingPartnerName}
                  onChange={(v) => set("recyclingPartnerName", v)}
                />
                <FormField
                  label="Customer Return Channel"
                  value={form.customerReturnChannelName}
                  onChange={(v) => set("customerReturnChannelName", v)}
                />
                <FormField
                  label="Component Supplier"
                  value={form.componentSupplierName}
                  onChange={(v) => set("componentSupplierName", v)}
                />
              </div>
            </fieldset>
          </DataLayerGroup>
        </CollapsibleSection>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm rounded-lg bg-[var(--color-brand-pink)] text-white font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {submitting ? "Registering…" : "Register DPP"}
          </button>
        </div>
      </form>
    </main>
  );
}
