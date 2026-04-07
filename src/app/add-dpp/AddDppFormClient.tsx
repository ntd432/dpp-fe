"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form/FormField";
import { CollapsibleSection, DataLayerGroup } from "@/components/form/CollapsibleSection";
import { AddEntryButton } from "@/components/form/AddEntryButton";
import { useLanguage } from "@/contexts/LanguageContext";

const INPUT_CLASS =
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)] w-full";

const GRANULARITY_OPTIONS = ["model", "batch", "item"] as const;
const DATA_CARRIER_FORMAT_OPTIONS = ["QR code", "NFC", "RFID", "DataMatrix"] as const;

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

export interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

export interface ProductOption {
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

interface ParticipantEntry {
  _key: string;
  name: string;
  url: string;
}

const emptyEvent = (): EventEntry => ({
  _key: uid(),
  actionName: "",
  actionType: "",
  time: "",
  locationName: "",
  actorName: "",
});

const emptyParticipant = (): ParticipantEntry => ({
  _key: uid(),
  name: "",
  url: "",
});

function EventArrayEditor({
  label,
  events,
  onChange,
  t,
}: Readonly<{
  label: string;
  events: EventEntry[];
  onChange: (events: EventEntry[]) => void;
  t: (key: string) => string;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([...events, emptyEvent()])} />
      </div>
      {events.map((ev, i) => (
        <div key={ev._key} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={t("Action name")}
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
              placeholder={t("Action type")}
              value={ev.actionType}
              onChange={(e) => updateAt(events, i, "actionType", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Location name")}
              value={ev.locationName}
              onChange={(e) => updateAt(events, i, "locationName", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              placeholder={t("Actor name")}
              value={ev.actorName}
              onChange={(e) => updateAt(events, i, "actorName", e.target.value, onChange)}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]"
            />
          </div>
          <button
            type="button"
            onClick={() => removeAt(events, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
          >
            {t("Remove")}
          </button>
        </div>
      ))}
    </div>
  );
}

function ParticipantArrayEditor({
  label,
  participants,
  onChange,
  t,
}: Readonly<{
  label: string;
  participants: ParticipantEntry[];
  onChange: (participants: ParticipantEntry[]) => void;
  t: (key: string) => string;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <AddEntryButton label={t("+ Add Entry")} onClick={() => onChange([...participants, emptyParticipant()])} />
      </div>
      {participants.map((participant, i) => (
        <div key={participant._key} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={t("Name")}
              value={participant.name}
              onChange={(e) => updateAt(participants, i, "name", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
            <input
              type="url"
              placeholder={t("URL")}
              value={participant.url}
              onChange={(e) => updateAt(participants, i, "url", e.target.value, onChange)}
              className={INPUT_CLASS}
            />
          </div>
          <button
            type="button"
            onClick={() => removeAt(participants, i, onChange)}
            className="text-red-400 hover:text-red-600 px-2 py-2 hover:cursor-pointer"
          >
            {t("Remove")}
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
  issuerMode: "existing" | "new";
  issuerId: string;
  issuerName: string;
  issuerUrl: string;
  productId: string;
  traceabilityEvents: EventEntry[];
  recyclingPartners: ParticipantEntry[];
  customerReturnChannels: ParticipantEntry[];
}

export default function AddDppFormClient({
  initialManufacturers,
  initialProducts,
}: Readonly<{
  initialManufacturers: ManufacturerOption[];
  initialProducts: ProductOption[];
}>) {
  const router = useRouter();
  const { t } = useLanguage();

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
    recyclingPartners: [],
    customerReturnChannels: [],
  });

  const [manufacturers] = useState<ManufacturerOption[]>(initialManufacturers);
  const [products] = useState<ProductOption[]>(initialProducts);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function validateRequiredFields(): string[] {
    const errors: string[] = [];

    if (!form.productBatchNumber.trim()) errors.push(t("Batch Number is required."));
    if (!form.productSerialNumber.trim()) errors.push(t("Serial Number is required."));
    if (!form.granularity) errors.push(t("DPP Granularity is required."));
    if (!form.dataCarrierFormat) errors.push(t("Data Carrier Format is required."));

    if (form.issuerMode === "existing" && !form.issuerId) {
      errors.push(t("DPP Issuer is required."));
    }

    if (form.issuerMode === "new" && !form.issuerName.trim()) {
      errors.push(t("Organisation Name is required when adding a new issuer."));
    }

    if (!form.productId) errors.push(t("Linked Product is required."));

    return errors;
  }

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

    const buildParticipants = (participants: ParticipantEntry[]) =>
      participants
        .filter((p) => p.name)
        .map((p) => {
          const participant: Record<string, unknown> = {};
          if (p.name) participant.name = p.name;
          if (p.url) participant.url = p.url;
          return participant;
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
      recyclingPartner: buildParticipants(form.recyclingPartners),
      customerReturnChannel: buildParticipants(form.customerReturnChannels),
    };

    return dpp;
  }

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

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 hover:cursor-pointer"
        >
          {`← ${t("addDpp.back")}`}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t("addDpp.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("addDpp.subtitle")}
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {t("addDpp.success")}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <CollapsibleSection title={t("Digital Product Passport Information")} defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={t("Batch Number")}
              value={form.productBatchNumber}
              onChange={(v) => set("productBatchNumber", v)}
              placeholder={t("e.g. BATCH-2025-001")}
              required
            />
            <FormField
              label={t("Serial Number")}
              value={form.productSerialNumber}
              onChange={(v) => set("productSerialNumber", v)}
              placeholder={t("e.g. SN-00123456")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="granularity" className="block text-sm font-medium text-gray-700 mb-1">
                {t("DPP Granularity")}
              </label>
              <select
                id="granularity"
                value={form.granularity}
                onChange={(e) => set("granularity", e.target.value)}
                className={INPUT_CLASS}
                required
              >
                <option value="">{t("Select granularity")}</option>
                {GRANULARITY_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {t(g.charAt(0).toUpperCase() + g.slice(1))}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dataCarrierFormat" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Data Carrier Format")}
              </label>
              <select
                id="dataCarrierFormat"
                value={form.dataCarrierFormat}
                onChange={(e) => set("dataCarrierFormat", e.target.value)}
                className={INPUT_CLASS}
                required
              >
                <option value="">{t("Select format")}</option>
                {DATA_CARRIER_FORMAT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {t(f)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="issuer-select" className="block text-sm font-medium text-gray-700 mb-1">
              {t("DPP Issuer")}
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
              <option value="">{t("Select an organisation")}</option>
              {manufacturers.map((m) => (
                <option key={m.id} value={m.id ?? ""}>
                  {m.name ?? m.id}
                </option>
              ))}
              <option value="__new__">{t("+ Add a new organisation")}</option>
            </select>
          </div>

          {form.issuerMode === "new" && (
            <div className="grid grid-cols-2 gap-4 border-l-2 border-[var(--color-brand-blue-light)] pl-3">
              <FormField
                label={t("Organisation Name")}
                value={""}
                onChange={(v) => set("issuerName", v)}
                placeholder={t("e.g. Acme Corp")}
                required
              />
              <FormField
                label={t("Website URL")}
                value={""}
                onChange={(v) => set("issuerUrl", v)}
                type="url"
                placeholder={t("https://example.com")}
              />
            </div>
          )}

          <div>
            <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-1">
              {t("Linked Product to this DPP")}
            </label>
            <select
              id="product-select"
              value={form.productId}
              onChange={(e) => set("productId", e.target.value)}
              className={INPUT_CLASS}
              required
            >
              <option value="">{t("— None —")}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id ?? ""}>
                  {p.label ?? p.id}
                </option>
              ))}
            </select>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("Product Supply Chain Information")} defaultOpen>
          <DataLayerGroup layer="Regulatory">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  {t("Product Traceability")}
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-4 px-4 pb-4 pt-2">
                <EventArrayEditor
                  label={t("Traceability Events")}
                  events={form.traceabilityEvents}
                  onChange={(v) => set("traceabilityEvents", v)}
                  t={t}
                />
              </div>
            </details>
          </DataLayerGroup>

          <DataLayerGroup layer="Commercial">
            <details open className="group/extension bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  {t("Supply Chain Partners")}
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open/extension:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-4 px-4 pb-4 pt-2">
                <ParticipantArrayEditor
                  label={t("Recycling Partner")}
                  participants={form.recyclingPartners}
                  onChange={(v) => set("recyclingPartners", v)}
                  t={t}
                />
                <ParticipantArrayEditor
                  label={t("Customer Return Channel")}
                  participants={form.customerReturnChannels}
                  onChange={(v) => set("customerReturnChannels", v)}
                  t={t}
                />
              </div>
            </details>
          </DataLayerGroup>
        </CollapsibleSection>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
          >
            {t("addDpp.cancel")}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm rounded-lg bg-[var(--color-brand-pink)] text-white font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {submitting ? t("addDpp.submitting") : t("addDpp.submit")}
          </button>
        </div>
      </form>
    </main>
  );
}
