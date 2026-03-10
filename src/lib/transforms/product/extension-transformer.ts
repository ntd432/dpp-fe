import {
  copyUnhandledProperties,
  createDataPoint,
  createNode,
} from "./shared";

type ExtensionTransformer = (
  extension: Record<string, unknown>,
  label: string,
  idPrefix: string,
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
): Record<string, unknown> {
  const extensionType =
    typeof extension.extensionType === "string" ? extension.extensionType : "";

  const transformer = extensionTransformers[extensionType];
  if (transformer) {
    return transformer(extension, label, idPrefix);
  }

  return createDataPoint(extension, "Extension", label, idPrefix);
}

function transformElectronicExtension(
  electronics: Record<string, unknown>,
  label: string,
  idPrefix: string,
): Record<string, unknown> {
  const result = createNode(electronics, "ElectronicExtension", label, idPrefix);
  copyUnhandledProperties(
    electronics,
    result,
    new Set(["id", "@id", "@type", "extensionType"]),
  );
  return result;
}
