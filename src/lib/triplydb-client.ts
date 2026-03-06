import App from "@triply/triplydb";
import jsonld from "jsonld";
import { randomUUID } from "node:crypto";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

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

    await dataset.ensureService("sparql", { type: "virtuoso" });

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

  jsonLdPayload["@id"] = payload.id ?? `urn:generated:${randomUUID()}`;

  jsonLdPayload["@type"] ??= type;

  // Transform nested objects
  transformNestedObjects(jsonLdPayload);

  return jsonLdPayload;
}