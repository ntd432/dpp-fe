import InfoCard, { InfoCardWithLink } from "@/components/InfoCard";
import { Component, Event, Organization, Person } from "@/types/dpp-core";

const IGNORE_LIST = new Set(["type"]); // Keys to ignore in the display tree, can be extended as needed.

function prettyLabel(key: string): string {
  return key
    .replaceAll(/([A-Z])/g, " $1")
    .replaceAll(/[_-]+/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function toDisplayString(value: string | number | boolean | null): string {
  if (value === null) return "null";
  return String(value);
}

export function beautifyTimeString(time?: string): string {
  if (!time) return "N/A";

  const parsed = new Date(time);
  if (Number.isNaN(parsed.getTime())) return time;

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(parsed);
}

export function ListCards<T>({
  list,
  label,
  getKey,
  renderCard,
}: Readonly<{
  list: ReadonlyArray<T>;
  label: string;
  getKey: (item: T, index: number) => string;
  renderCard: (item: T) => React.ReactNode;
}>) {
  if (list === undefined) {
    return null;
  }

  if (list.length === 0) {
    return <ValueTree label={label} value="No data" />;
  }

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-semibold">{label}</p>}
      {list.map((item, index) => (
        <div key={getKey(item, index)}>{renderCard(item)}</div>
      ))}
    </div>
  );
}

export function KeyValuePair({ indent=false, numberOfColumn, pairs }: Readonly<{ indent?: boolean; numberOfColumn: number; pairs: ReadonlyArray<{ label: string; value: string | undefined }> }>) {
  return (
    <div className={`${indent ? "ml-5" : ""} rounded-lg bg-white p-3 border border-gray-200`}>
      <div className={`grid grid-cols-1 md:grid-cols-${numberOfColumn} gap-3`}>
        {pairs.map((pair) => (
          <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
      </div>
    </div>
  );
}

export function ValueTree({ label, value }: Readonly<{ label: string; value: unknown }>) {
  if (value === undefined) return null;

  if (IGNORE_LIST.has(label.toLowerCase())) return null;

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <InfoCard label={label} value={toDisplayString(value)} />;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <InfoCard label={prettyLabel(label)} value="No data" />;

    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{prettyLabel(label)}</p>
        <div className="space-y-3 border border-gray-200 rounded-lg">
        {value.map((item, index) => (
          <div key={`${label}-${index}`} className="rounded-lg bg-white p-3">
            <ValueTree label={`${label} ${index + 1}`} value={item} />
          </div>
        ))}
        </div>
      </div>
    );
  }

  const entries = Object.entries(value).filter(([, nestedValue]) => nestedValue !== undefined);
  if (entries.length === 0) return <InfoCard label={label} value="No data" />;

  return (
    <details open className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <summary className="list-none cursor-pointer px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {label}
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="space-y-3 px-4 py-3">
        {entries.map(([childKey, childValue]) => (
          <ValueTree key={`${label}-${childKey}`} label={childKey} value={childValue} />
        ))}
      </div>
    </details>
  );
}

export function ComponentListCard({label, componentList}: Readonly<{ label: string; componentList: ReadonlyArray<Component> }>) {
  return (
      <ListCards
        list={componentList}
        label={label}
        getKey={(component, index) =>
          `component-${component.componentName || index}`
        }
        renderCard={(component) => ComponentCard(component)}
      />
    );
}

function ComponentCard(component: Readonly<Component>) {
  let componentName = component.componentName || "Unnamed Component";
  if (component.componentPercentage !== undefined) {
    componentName = `${componentName} (${component.componentPercentage}%)`;
  } else if (component.componentCountValue !== undefined) {
    componentName = `${componentName} (${component.componentCountValue} ${component.componentCountUnit || "units"})`;
  }
  const componentPairs = [
    { label: "Component", value: componentName },
    { label: "Component Reference", value: component.componentReference },
    { label: "Component URI", value: component.componentURI },
  ];
  return (
    <div className="ml-5 rounded-lg bg-white p-3 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {componentPairs.map((pair) => (
          <ValueTree key={pair.label} label={pair.label} value={pair.value} />
        ))}
        {component.componentSupplier && (
          <InfoCardWithLink
            label="Component Supplier"
            value={component.componentSupplier?.name || "N/A"}
            link={component.componentSupplier?.url}
          />
        )}
      </div>
    </div>

  );
}

export function EventListCard({ list, label }: Readonly<{
  label: string;
  list: Readonly<ReadonlyArray<Event>>;
}>) {
  return (
    <ListCards
      list={list}
      label={label}
      getKey={(event, index) =>
        `event-${event.actionName || index}`
      }
      renderCard={(event) => EventCard(event)}
    />
  );
}

function EventCard(event: Readonly<Event>) {
  const pairs = [
    { label: "Event type", value: event.actionType },
    { label: "Action name", value: event.actionName },
    { label: "Time", value: beautifyTimeString(event.time) },
    { label: "Location", value: event.location?.name },
    { label: "Address", value: event.location?.address },
    { label: "Actor", value: "name" in (event.actor || {}) ? event.actor?.name : undefined },
  ];
  return <KeyValuePair numberOfColumn={3} pairs={pairs} />;
}

export function ParticipantListCard({ list, label }: Readonly<{
  label: string;
  list: Readonly<ReadonlyArray<Organization | Person>>;
}>) {
  return (
    <ListCards
      list={list}
      label={label}
      getKey={(participant, index) =>
        `participant-${participant.name || index}`
      }
      renderCard={(participant) => ParticipantCard(participant)}
    />
  );
}

function ParticipantCard(participant: Readonly<Organization | Person>) {
  return (
    (participant.url ? 
    <InfoCardWithLink label="" value={participant.name || "N/A"} link={participant.url} /> 
    : <InfoCard label="" value={participant.name || "N/A"} />)
  );
}