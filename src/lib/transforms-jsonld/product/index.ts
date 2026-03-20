import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { transformCompliance } from "../data-groups/compliance-transform";
import { transformEndOfLifeData } from "../data-groups/end-of-life-transform";
import { transformGuidelinesAndManuals } from "../data-groups/guidelines-transform";
import { transformProductInformation } from "../data-groups/product-info-transform";
import { isRecord } from "../shared";
import { transformSupplyChain } from "../data-groups/supply-chain-transform";
import { transformSustainabilityInformation } from "../data-groups/sustainability-transform";
import { transformUsageInformation } from "../data-groups/usage-transform";

export async function getContext(): Promise<Record<string, unknown>> {
  const contextsDir = join(process.cwd(), "src", "contexts");

  const contextFiles = [
    "base.context.jsonld",
    "dpp-core.context.jsonld",
    "dpp-product-info.context.jsonld",
    "dpp-compliance.context.jsonld",
    "dpp-supply-chain.context.jsonld",
    "dpp-sustainability.context.jsonld",
    "dpp-eol.context.jsonld",
    "dpp-guidelines.context.jsonld",
    "dpp-usage.context.jsonld",
    "dpp-electronics.context.jsonld",
  ];

  const raws = await Promise.all(
    contextFiles.map((fileName) => readFile(join(contextsDir, fileName), "utf-8")),
  );

  const mergedContext: Record<string, unknown> = {};

  for (const raw of raws) {
    const parsed = JSON.parse(raw) as { "@context": unknown };
    const context = parsed["@context"];

    if (Array.isArray(context)) {
      for (const entry of context) {
        if (typeof entry === "object" && entry !== null && !Array.isArray(entry)) {
          Object.assign(mergedContext, entry as Record<string, unknown>);
        }
      }
      continue;
    }

    if (typeof context === "object" && context !== null) {
      Object.assign(mergedContext, context as Record<string, unknown>);
    }
  }

  return mergedContext;
}

export function transformNestedObjects(product: Record<string, unknown>): void {
  const dataGroup: Record<string, unknown>[] = [];

  if (isRecord(product.productInfo)) {
    dataGroup.push(transformProductInformation(product.productInfo));
  }
  if (isRecord(product.compliance)) {
    dataGroup.push(transformCompliance(product.compliance));
  }
//   if (isRecord(product.supplyChain)) {
//     dataGroup.push(transformSupplyChain(product.supplyChain));
//   }
  if (isRecord(product.sustainability)) {
    dataGroup.push(transformSustainabilityInformation(product.sustainability));
  }
  if (isRecord(product.endOfLife)) {
    dataGroup.push(transformEndOfLifeData(product.endOfLife));
  }
  if (isRecord(product.guidelines)) {
    dataGroup.push(transformGuidelinesAndManuals(product.guidelines));
  }
//   if (isRecord(product.usage)) {
//     dataGroup.push(transformUsageInformation(product.usage));
//   }

  delete product.productInfo;
  delete product.compliance;
//   delete product.supplyChain;
  delete product.sustainability;
  delete product.endOfLife;
  delete product.guidelines;
//   delete product.usage;

  product.dataGroup = dataGroup;
}
