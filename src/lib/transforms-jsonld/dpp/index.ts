import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createDataPoint, isRecord, transformOrganization } from "../shared";
import { transformSupplyChain } from "../data-groups/supply-chain-transform";
import { transformUsageInformation } from "../data-groups/usage-transform";

export async function getContext(): Promise<Record<string, unknown>> {
  const contextsDir = join(process.cwd(), "src", "contexts");

  const contextFiles = [
    "base.context.jsonld",
    "dpp-core.context.jsonld",
    "dpp-supply-chain.context.jsonld",
    "dpp-usage.context.jsonld",
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

export function transformNestedObjects(dpp: Record<string, unknown>): void {
  const dataGroup: Record<string, unknown>[] = [];

  if (isRecord(dpp.supplyChain)) {
    dataGroup.push(transformSupplyChain(dpp.supplyChain));
  }
  if (isRecord(dpp.usage)) {
    dataGroup.push(transformUsageInformation(dpp.usage));
  }
  if (isRecord(dpp.issuer)) {
    if (!dpp.issuer.identifier) {
      dpp.issuer = transformOrganization(dpp.issuer);
    }
  }

  if (dpp.product && typeof dpp.product === "object" && dpp.product !== null) {
    dpp.product = {...dpp.product, dpp: dpp.id};
  }

  delete dpp.supplyChain;
  delete dpp.usage;

  dpp.dataGroup = dataGroup;
}
