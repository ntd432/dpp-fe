import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
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
    const rp = createDataPoint({}, "RecyclingPartner", "Recycling Partner", "recycling-partner");
    rp.recyclingPartner = transformOrganization(supplyChain.recyclingPartner);
    dataPoint.push(rp);
  }
  if (isRecord(supplyChain.customerReturnChannel)) {
    const crc = createDataPoint({}, "CustomerReturnChannel", "Customer Return Channel", "customer-return-channel");
    crc.customerReturnChannel = transformOrganization(supplyChain.customerReturnChannel);
    dataPoint.push(crc);
  }
  if (isRecord(supplyChain.componentSupplier)) {
    const cs = createDataPoint({}, "ComponentSupplier", "Component Supplier", "component-supplier");
    cs.componentSupplier = transformOrganization(supplyChain.componentSupplier);
    dataPoint.push(cs);
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
