export function isAllowedRequestOrigin(
  origin: string | null,
  requestOrigin: string,
  configuredUrl: string | undefined,
  production: boolean
): boolean {
  if (!origin || origin === "null") return false;
  try {
    const supplied = new URL(origin);
    if (supplied.origin !== origin || !["http:", "https:"].includes(supplied.protocol)) return false;
    // Proxy headers are caller-controlled unless explicitly sanitized upstream.
    // Production trusts only a configured public URL, never the internal host.
    if (!configuredUrl && production) return false;
    const trusted = new URL(configuredUrl || requestOrigin);
    if (trusted.username || trusted.password || !["http:", "https:"].includes(trusted.protocol)) return false;
    return supplied.origin === trusted.origin;
  } catch {
    return false;
  }
}
