import { describeSubjectFromTriplyDB } from "@/lib/api";
import { transformToProductJson } from "@/lib/transforms-json/product";

export async function getProductById(id: string): Promise<Record<string, unknown>> {
    const describeResult = await describeSubjectFromTriplyDB(
        `urn:product:generated:${id}`,
    );
    const productData = await transformToProductJson(describeResult);
    return productData;
}