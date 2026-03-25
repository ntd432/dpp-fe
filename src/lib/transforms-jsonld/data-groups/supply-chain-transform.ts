import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
  handleAdditionalProperties,
  isRecord,
  transformEvent,
  transformOrganization,
} from "../shared";

export function transformSupplyChain(supplyChain: Record<string, unknown>): Record<string, unknown> {
  const result = createNode(supplyChain, "SupplyChain", "Supply Chain", "supply-chain");
  const dataPoint: Record<string, unknown>[] = [];

  if (isRecord(supplyChain.productTraceability)) {
    dataPoint.push(transformProductTraceability(supplyChain.productTraceability));
  }
  if (isRecord(supplyChain.recyclingPartner)) {
    dataPoint.push(transformRecyclingPartner(supplyChain.recyclingPartner));
  }
  if (isRecord(supplyChain.customerReturnChannel)) {
    dataPoint.push(transformCustomerReturnChannel(supplyChain.customerReturnChannel));
  }
  if (isRecord(supplyChain.additionalProperties)) {
    handleAdditionalProperties(result, supplyChain.additionalProperties, "dpp-supply-chain");
  }

  result.dataPoint = dataPoint;
  return result;
}

function transformProductTraceability(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "ProductTraceability", "Product Traceability", "product-traceability");
  if (Array.isArray(value.traceabilityEvent)) {
    result.traceabilityEvent = value.traceabilityEvent.filter(isRecord).map((event) => transformEvent(event));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type", "traceabilityEvent"]));
  return result;
}

function transformRecyclingPartner(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "RecyclingPartner", "Recycling Partner", "recycling-partner");
  if (Array.isArray(value.recyclingPartner)) {
    result.recyclingPartner = value.recyclingPartner.filter(isRecord).map((partner) => transformOrganization(partner));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]), "recyclingPartner");
  return result;
}

function transformCustomerReturnChannel(value: Record<string, unknown>): Record<string, unknown> {
  const result = createDataPoint(value, "CustomerReturnChannel", "Customer Return Channel", "customer-return-channel");
  if (Array.isArray(value.customerReturnChannel)) {
    result.customerReturnChannel = value.customerReturnChannel.filter(isRecord).map((channel) => transformOrganization(channel));
  }
  copyUnhandledProperties(value, result, new Set(["id", "@id", "@type"]), "customerReturnChannel");
  return result;
}
