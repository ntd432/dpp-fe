import { transformElectronicExtension } from "../extensions/electronics-transformer";
import { createDataPoint } from "../shared";

type ExtensionTransformer = (
  extension: Record<string, unknown>,
  label: string,
  idPrefix: string,
  previousPredicate: string
) => Record<string, unknown>;

const extensionTransformers: Record<string, ExtensionTransformer> = {
  ElectronicExtension: transformElectronicExtension,
};

export function registerExtensionTransformer(
  extensionType: string,
  transformer: ExtensionTransformer,
): void {
  extensionTransformers[extensionType] = transformer;
}

export function transformExtension(
  extension: Record<string, unknown>,
  label: string,
  idPrefix: string,
  previousPredicate: string,
): Record<string, unknown> {
  const extensionType =
    typeof extension.extensionType === "string" ? extension.extensionType : "";

  const transformer = extensionTransformers[extensionType];
  if (transformer) {
    return transformer(extension, label, idPrefix, previousPredicate);
  }

  return createDataPoint(extension, "Extension", label, idPrefix);
}
