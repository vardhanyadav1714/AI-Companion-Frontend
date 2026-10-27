import { isIP } from "node:net";

// The public ingress must overwrite X-Real-IP and the Next server must not have
// an independently published port. Never forward a client-supplied proxy key.
export function clientIpHeaders(incoming: Headers, key: string): Record<string, string> {
  const address = incoming.get("x-real-ip")?.trim();
  if (!key || !address || !isIP(address)) return {};
  return { "X-Eva-Client-IP": address, "X-Eva-Proxy-Key": key };
}
