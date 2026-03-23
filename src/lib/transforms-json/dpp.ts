import { getProductById } from "@/services/product.service";
import { describeSubjectFromTriplyDB } from "../api";
import { transformToJsonFromDescribeResult } from "../triplydb-client";
import { transformDataGroupJson } from "./data-groups";
import { SUPPLY_CHAIN_PREFIX, USAGE_PREFIX, DATA_GROUP_PREDICATE } from "../../../next.config";

const IGNORE_PREDICATES: Set<string> = new Set([
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2000/01/rdf-schema#comment",
]);

const PREDICATE_TO_FIELDNAME: Record<string, string> = {
  [`${SUPPLY_CHAIN_PREFIX}SupplyChain`]: "supplyChain",
  [`${USAGE_PREFIX}UsageInformation`]: "usage",
};

async function handleDataGroupNode(
  child: Record<string, unknown>,
  fieldName: string,
  result: Record<string, unknown>
): Promise<string> {
  const dataGroupName = child.type || "UnnamedDataGroup";
  const mappedFieldName = PREDICATE_TO_FIELDNAME[dataGroupName as string] || fieldName;
  result[mappedFieldName] = await transformDataGroupJson(child);
  return mappedFieldName;
}

function handleRegularNode(
  child: Record<string, unknown>,
  fieldName: string,
  result: Record<string, unknown>
): void {
  if (fieldName in result) {
    if (Array.isArray(result[fieldName])) {
      (result[fieldName] as Record<string, unknown>[]).push(child);
    } else {
      result[fieldName] = [result[fieldName] as Record<string, unknown>, child];
    }
  } else {
    result[fieldName] = child;
  }
}

export async function transformToDPPJson(describeResult: Record<string, any>[][]): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const triple of describeResult) {
    const predicate = triple[1]?.value;

    if (IGNORE_PREDICATES.has(predicate)) {
      continue;
    }

    const fieldName = triple[1]?.value.split("/").pop()?.split("#").pop() || triple[1]?.value;
    const objectTermType = triple[2]?.termType;
    const object = triple[2]?.value;

    if (fieldName === "product") {
      const productId = object.split(":").pop();
      result[fieldName] = await getProductById(productId as string);
      continue;
    }

    if (objectTermType === "Literal") {
      result[fieldName] = object;
    } else if (objectTermType === "NamedNode") {
      const childDescribeResult = await describeSubjectFromTriplyDB(object);
      const child = await transformToJsonFromDescribeResult(childDescribeResult);

      if (predicate === DATA_GROUP_PREDICATE) {
        await handleDataGroupNode(child, fieldName, result);
      } else {
        handleRegularNode(child, fieldName, result);
      }
    }
  }
  return result;
}