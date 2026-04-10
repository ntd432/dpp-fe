export function isPhoneUserAgent(userAgent: string): boolean {
  const normalized = userAgent.toLowerCase();

  const isTablet = /ipad|tablet|playbook|silk|kindle|android(?!.*mobile)/i.test(normalized);
  const isMobile = /mobi|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(normalized);

  return isMobile && !isTablet;
}
