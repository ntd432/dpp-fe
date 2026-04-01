import { TriplyDBClient } from "@/lib/triplydb-client";
import { transformToDPPJson } from "@/lib/transforms-json/dpp";

export async function getDPPById(id: string): Promise<Record<string, unknown>> {
    const describeResult = await TriplyDBClient.describeSubjectFromTriplyDB(
        `urn:dpp:generated:${id}`,
    );
    const dppData = await transformToDPPJson(describeResult);
    return dppData;
}