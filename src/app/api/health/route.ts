import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", service: "eva-web" }, {
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });
}
