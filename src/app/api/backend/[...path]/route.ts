import { NextRequest, NextResponse } from "next/server";
import { isAllowedRequestOrigin } from "@/lib/request-origin";
import { clientIpHeaders } from "@/lib/client-ip";

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
  const peerHeaders = clientIpHeaders(request.headers, process.env.WEB_PROXY_KEY || "");
  let refreshed: { accessToken: string; refreshToken?: string } | undefined;
  if (!token && request.cookies.get("eva_refresh")?.value) {
    const refresh = await fetch(`${base.replace(/\/$/, "")}/auth/refresh`, {
      method: "POST", headers: { "Content-Type": "application/json", ...peerHeaders }, redirect: "error",
      body: JSON.stringify({ refreshToken: request.cookies.get("eva_refresh")!.value }),
      cache: "no-store", signal: AbortSignal.timeout(10000)
    });
    const result = await refresh.json();
    if (refresh.ok && result.success) { refreshed = result.data; token = refreshed?.accessToken; }
  }
  const body = request.method === "GET" ? undefined : await request.text();
  const options: RequestInit = {
    method: request.method, body,
    headers: { "Content-Type": "application/json", ...peerHeaders, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    redirect: "error",
    cache: "no-store", signal: AbortSignal.timeout(60000)
  };
  let response = await fetch(target, options);
  if (response.status === 401 && !refreshed && request.cookies.get("eva_refresh")?.value) {
    const refresh = await fetch(`${base.replace(/\/$/, "")}/auth/refresh`, {
      method: "POST", headers: { "Content-Type": "application/json", ...peerHeaders }, redirect: "error",
      body: JSON.stringify({ refreshToken: request.cookies.get("eva_refresh")!.value }),
      cache: "no-store", signal: AbortSignal.timeout(10000)
    });
    const result = await refresh.json();
    if (refresh.ok && result.success) {
      refreshed = result.data;
      token = refreshed?.accessToken;
      await response.body?.cancel();
      response = await fetch(target, { ...options, headers: { "Content-Type": "application/json", ...peerHeaders, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(60000) });
    }
  }
  if (request.method === "GET" && path.length === 2 && path[0] === "media" && response.ok) {
    const reply = new NextResponse(response.body, { status: response.status, headers: {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"
    } });
    if (refreshed) {
      const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
      reply.cookies.set("eva_access", refreshed.accessToken, { ...options, maxAge: 900 });
      if (refreshed.refreshToken) reply.cookies.set("eva_refresh", refreshed.refreshToken, { ...options, maxAge: 30 * 86400 });
    }
    return reply;
  }
  const payload = await response.json();
  if (path.length === 2 && path[0] === "auth" && ["logout", "logout-all"].includes(path[1]) && response.ok) {
    const reply = NextResponse.json(payload, { status: response.status });
    reply.cookies.set("eva_access", "", { path: "/", maxAge: 0 });
    reply.cookies.set("eva_refresh", "", { path: "/", maxAge: 0 });
    return reply;
  }
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
export const PATCH = proxy;
export const DELETE = proxy;
