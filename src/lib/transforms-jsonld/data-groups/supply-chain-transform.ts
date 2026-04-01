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
  if (Array.isArray(supplyChain.recyclingPartner)) {
    const result = createDataPoint({}, "RecyclingPartner", "Recycling Partner", "recycling-partner");
    result.recyclingPartner = supplyChain.recyclingPartner.filter(isRecord).map((partner) => transformOrganization(partner));
    dataPoint.push(result);
  }
  if (Array.isArray(supplyChain.customerReturnChannel)) {
    const result = createDataPoint({}, "CustomerReturnChannel", "Customer Return Channel", "customer-return-channel");
    result.customerReturnChannel = supplyChain.customerReturnChannel.filter(isRecord).map((channel) => transformOrganization(channel));
    dataPoint.push(result);
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
