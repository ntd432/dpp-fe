import { describeSubjectFromTriplyDB } from "@/lib/api";
import { transformToDPPJson } from "@/lib/transforms-json/dpp";

export async function getDPPById(id: string): Promise<Record<string, unknown>> {
    const describeResult = await describeSubjectFromTriplyDB(
        `urn:dpp:generated:${id}`,
    );
    const dppData = await transformToDPPJson(describeResult);
    return dppData;
}