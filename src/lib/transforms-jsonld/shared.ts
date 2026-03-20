import { randomUUID } from "node:crypto";
import { getDataLayer } from "@/config/DataLayerConfig";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createDataPoint(
  source: Record<string, unknown>,
  type: string,
  _label: string,
  idPrefix: string,
): Record<string, unknown> {
  const dataLayer = getDataLayer(type);
  if (!dataLayer) {
    return {
      "@type": type,
      "@id": source.id ?? `urn:generated:${idPrefix}:${randomUUID()}`,
    };
  }
  return {
    "@type": type,
    "@id": source.id ?? `urn:generated:${idPrefix}:${randomUUID()}`,
    dataLayer,
  };
}

export function createNode(
  source: Record<string, unknown>,
  type: string,
  _label: string,
  idPrefix: string,
): Record<string, unknown> {
  return {
    "@type": type,
    "@id": source.id ?? `urn:${idPrefix}:generated:${randomUUID()}`,
  };
}

export function copyUnhandledProperties(
  source: Record<string, unknown>,
  result: Record<string, unknown>,
  handled: Set<string>,
  prefix = "",
): void {
  for (const [key, value] of Object.entries(source)) {
    if (!handled.has(key)) {
      if (prefix) {
        result[`${prefix}:${key}`] = value;
      } else {
        result[key] = value;
      }
    }
  }
}

export function transformEvent(event: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(event, "Event", "Event", "event");

  if (isRecord(event.location)) {
    result.location = transformPlace(event.location);
  }

  if (isRecord(event.actor)) {
    result.actor = transformOrganization(event.actor);
  }

  copyUnhandledProperties(event, result, new Set(["id", "@id", "@type", "location", "actor"]));
  return result;
}

export function transformPlace(place: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(place, "Place", "Place", "place");
  copyUnhandledProperties(place, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformGuide(guide: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(guide, "Guide", "Guide", "guide");
  copyUnhandledProperties(guide, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformImageObject(image: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(image, "ImageObject", "Image", "image");
  copyUnhandledProperties(image, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformOrganization(org: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(org, "Organization", "Organization", "organization");
  copyUnhandledProperties(org, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformLegislation(legislation: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(legislation, "Legislation", "Legislation", "legislation");
  copyUnhandledProperties(legislation, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformCertificationInfo(certification: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(certification, "Certification", "Certification", "certification");
  copyUnhandledProperties(certification, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformCountry(country: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(country, "Country", "Country", "country");
  copyUnhandledProperties(country, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformSubstance(substance: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(substance, "Substance", "Substance", "substance");
  copyUnhandledProperties(substance, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function transformResourceConsumption(resources: Record<string, unknown>[]): Record<string, unknown>[] {
  return resources.map((resource) => {
    const result = createNode(resource, "ResourceConsumption", "Resource Consumption", "resource-consumption");
    copyUnhandledProperties(resource, result, new Set(["id", "@id", "@type"]));
    return result;
  });
}

export function transformEnvironmentalFootprint(footprints: Record<string, unknown>[]): Record<string, unknown>[] {
  return footprints.map((footprint) => {
    const result = createNode(footprint, "EnvironmentalFootprint", "Environmental Footprint", "environmental-footprint");
    copyUnhandledProperties(footprint, result, new Set(["id", "@id", "@type"]));
    return result;
  });
}

export function transformComponent(component: Record<string, unknown>[]): Record<string, unknown>[] {
  return component.map((item) => {
    const result = createNode(item, "Component", "Component", "component");
    copyUnhandledProperties(item, result, new Set(["id", "@id", "@type"]));
    return result;
  });
}

export function transformMeasurementEntry(measurement: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(measurement, "MeasurementEntry", "Measurement Entry", "measurement-entry");
  copyUnhandledProperties(measurement, result, new Set(["id", "@id", "@type"]));
  return result;
}

export function handleAdditionalProperties(current: Record<string, unknown>, info: Record<string, unknown>, prefix=""): Record<string, unknown> {
  copyUnhandledProperties(info, current, new Set(["id", "@id", "@type"]), prefix);
  return current;
}