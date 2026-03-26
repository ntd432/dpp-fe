import App from "@triply/triplydb";
import jsonld from "jsonld";
import { randomUUID } from "node:crypto";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describeSubjectFromTriplyDB } from "./api";
import { ARRAY_TYPES } from "../../next.config";

const INTEGER_TYPE = "http://www.w3.org/2001/XMLSchema#integer";
const DOUBLE_TYPE = "http://www.w3.org/2001/XMLSchema#double";
const IGNORE_PREDICATES = new Set([
  // "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2000/01/rdf-schema#comment",
  "https://ntd432.github.io/dpp/models/dpp-core.ttl#dpp",
  // "https://ntd432.github.io/dpp/models/dpp-core.ttl#dataLayer"
]);

export interface TriplyDBConfig {
  token: string;
  datasetName: string;
  graphName: string;
}

export interface TriplyDBUploadResult {
  graphName: string;
  tripleCount: number;
}

// export async function toJsonLdPayload

export async function uploadToTriplyDB(
  jsonLdPayload: Record<string, unknown>,
  config: TriplyDBConfig
): Promise<TriplyDBUploadResult> {
  let tempFile: string | undefined;

  try {
    const nquads = (await jsonld.toRDF(jsonLdPayload, {
      format: "application/n-quads",
    })) as string;

    if (!nquads || nquads.trim().length === 0) {
      throw new TriplyUploadError("JSON-LD payload produced no RDF triples", 422);
    }

    const tripleCount = nquads.trim().split("\n").length;

    const tempDir = join(tmpdir(), "dpp-upload");
    await mkdir(tempDir, { recursive: true });
    tempFile = join(tempDir, `dpp-${randomUUID()}.nq`);
    await writeFile(tempFile, nquads, "utf-8");

    const triply = App.get({ token: config.token });
    const account = await triply.getAccount();
    const dataset = await account.getDataset(config.datasetName);

    await dataset.importFromFiles([tempFile], {
      defaultGraphName: config.graphName,
      mergeGraphs: true,
    });

    await dataset.ensureService("sparql");

    return { graphName: config.graphName, tripleCount };
  } catch (error: unknown) {
    if (error instanceof TriplyUploadError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown upload error";
    throw new TriplyUploadError(`Failed to upload to TriplyDB: ${message}`, 500);
  } finally {
    if (tempFile) {
      await unlink(tempFile).catch(() => {});
    }
  }
}

export class TriplyUploadError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "TriplyUploadError";
  }
}

export async function toJsonLdPayload(
  payload: Record<string, unknown>,
  type: string,
  getContext: Function,
  transformNestedObjects: Function
): Promise<Record<string, unknown>> {
  const jsonLdPayload =
    typeof payload === "string" ? JSON.parse(payload) : { ...payload };

  // Ensure @context is included
  jsonLdPayload["@context"] = await getContext();

  if (!payload.id) {
    jsonLdPayload["@id"] = `urn:${type}:generated:${randomUUID()}`;
  }

  jsonLdPayload["@type"] ??= type;

  // Transform nested objects
  transformNestedObjects(jsonLdPayload);

  return jsonLdPayload;
}

export async function transformToJsonFromDescribeResult(describeResult: Record<string, any>[][]): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const triple of describeResult) {
    const fieldName = triple[1]?.value.split("/").pop()?.split("#").pop() || triple[1]?.value;
    const predicate = triple[1]?.value;
    const objectTermType = triple[2]?.termType;
    const object = triple[2]?.value;
    const objectDataType = triple[2]?.datatype;

    if (IGNORE_PREDICATES.has(predicate)) {
      continue;
    }

    await processTriple(result, fieldName, objectTermType, object, objectDataType);
  }
  return result;
}

async function processTriple(
  result: Record<string, unknown>,
  fieldName: string,
  objectTermType: string | undefined,
  object: string,
  objectDataType: string | undefined
): Promise<void> {
  if (fieldName === "type") {
    result[fieldName] = object;
  } else if (objectTermType === "Literal") {
    result[fieldName] = handleLiteralValue(object, objectDataType);
  } else if (objectTermType === "NamedNode") {
    await processNamedNode(result, fieldName, object);
  }
}

async function processNamedNode(
  result: Record<string, unknown>,
  fieldName: string,
  object: string
): Promise<void> {
  const childDescribeResult = await describeSubjectFromTriplyDB(object);
  const child = await transformToJsonFromDescribeResult(childDescribeResult);
  
  if (fieldName in result) {
    if (Array.isArray(result[fieldName])) {
      (result[fieldName] as Record<string, unknown>[]).push(child);
    } else {
      result[fieldName] = [result[fieldName] as Record<string, unknown>, child];
    }
  } else if (ARRAY_TYPES.has(fieldName)) {
    result[fieldName] = [child];
  } else {
    result[fieldName] = child;
  }
}

function handleLiteralValue(object: string, objectDataType?: string) {
  if (objectDataType === INTEGER_TYPE) {
    return Number.parseInt(object, 10);
  }
  if (objectDataType === DOUBLE_TYPE) {
    return Number.parseFloat(object);
  }
  return object;
}
