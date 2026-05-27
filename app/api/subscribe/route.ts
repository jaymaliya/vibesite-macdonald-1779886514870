import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const VAANI_API = process.env.VAANI_API_URL ?? "https://vaani-ai-production.up.railway.app";
const VAANI_SITE = process.env.VAANI_SITE_ID ?? "";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").toString().trim();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    // Forward to Vaani backend for storage/email capture
    try {
      await fetch(`${VAANI_API}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, siteId: VAANI_SITE }),
      });
    } catch { /* Don't fail if backend is unreachable — still confirm to user */ }
    return NextResponse.json({ success: true, message: "Subscribed!" });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}