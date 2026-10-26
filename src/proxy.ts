import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = randomBytes(24).toString("base64");
  const development = process.env.NODE_ENV === "development";
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://accounts.google.com${development ? " 'unsafe-eval'" : ""}`,
    // Framer Motion and Google Identity use inline styles.
    "style-src 'self' 'unsafe-inline' https://accounts.google.com",
    "connect-src 'self' https://accounts.google.com" + (development ? " ws: wss:" : ""),
    "frame-src https://accounts.google.com",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com",
    "media-src 'self' data: blob:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(development ? [] : ["upgrade-insecure-requests"])
  ].join("; ");
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|branding/|images/).*)"]
};
