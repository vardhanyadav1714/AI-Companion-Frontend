import { NextRequest, NextResponse } from "next/server";
import { isAllowedRequestOrigin } from "@/lib/request-origin";

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
  const target = `${base.replace(/\/$/, "")}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  if (request.method !== "GET" && !isAllowedRequestOrigin(
    request.headers.get("origin"), request.nextUrl.origin,
    process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL,
    process.env.NODE_ENV === "production"
  )) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Invalid request origin" } }, { status: 403 });
  }
  let token = request.cookies.get("eva_access")?.value;
  let refreshed: { accessToken: string; refreshToken?: string } | undefined;
  if (!token && request.cookies.get("eva_refresh")?.value) {
    const refresh = await fetch(`${base.replace(/\/$/, "")}/auth/refresh`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: request.cookies.get("eva_refresh")!.value }),
      cache: "no-store", signal: AbortSignal.timeout(10000)
    });
    const result = await refresh.json();
    if (refresh.ok && result.success) { refreshed = result.data; token = refreshed?.accessToken; }
  }
  const body = request.method === "GET" ? undefined : await request.text();
  const response = await fetch(target, {
    method: request.method, body,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store", signal: AbortSignal.timeout(60000)
  });
  const payload = await response.json();
  const session = payload.success && payload.data?.accessToken ? payload.data : refreshed;
  if (session) {
    const { accessToken, refreshToken, ...publicData } = session;
    const reply = NextResponse.json(refreshed === session ? payload : { ...payload, data: publicData }, { status: response.status });
    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
    reply.cookies.set("eva_access", accessToken, { ...options, maxAge: 900 });
    if (refreshToken) reply.cookies.set("eva_refresh", refreshToken, { ...options, maxAge: 30 * 86400 });
    return reply;
  }
  return NextResponse.json(payload, { status: response.status });
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    return await forward(request, context);
  } catch {
    return NextResponse.json({ success: false, error: { message: "The service is temporarily unavailable. Please try again." } }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
