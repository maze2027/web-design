import { NextResponse } from "next/server";

/**
 * Booking/contact lead endpoint.
 *  1. LEAD_WEBHOOK_URL  → POST JSON (GoHighLevel inbound webhook, Zapier Catch Hook, Make…)
 *  2. RESEND_API_KEY + LEAD_EMAIL_TO → email fallback if the webhook is unset or fails
 * If neither is configured in production we return 503 so the visitor is told to call,
 * instead of silently losing the lead.
 */

const ALLOWED = {
  language: ["es", "en", "pt", "ar"],
  age: ["u17", "17-20", "21+"],
  service: ["permit", "lessons", "road-test", "nervous", "teen", "adult", "unsure"],
  times: ["wd-am", "wd-pm", "wd-eve", "sat"],
  locale: ["en", "es"],
};

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Light in-memory rate limit (per instance). Use a shared store (e.g. Upstash) for strict limits.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Spam traps: honeypot filled or submitted inhumanly fast → pretend success.
  if (str(body.company) || (typeof body.elapsedMs === "number" && body.elapsedMs < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const phoneDigits = str(body.phone, 40).replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  const email = str(body.email, 200);
  const lead = {
    name: str(body.name, 120),
    phone: phoneDigits ? `+1${phoneDigits}` : "",
    email,
    preferredLanguage: ALLOWED.language.includes(str(body.language)) ? str(body.language) : "en",
    ageGroup: str(body.age),
    service: str(body.service),
    bestTimes: Array.isArray(body.times) ? body.times.filter((x): x is string => typeof x === "string" && ALLOWED.times.includes(x)) : [],
    message: str(body.message, 2000),
    siteLocale: ALLOWED.locale.includes(str(body.locale)) ? str(body.locale) : "en",
    page: str(body.page, 200),
    source: "website",
    submittedAt: new Date().toISOString(),
  };

  const invalid =
    !lead.name ||
    phoneDigits.length !== 10 ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) ||
    !ALLOWED.age.includes(lead.ageGroup) ||
    !ALLOWED.service.includes(lead.service);
  if (invalid) return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      console.error("[lead] webhook responded", res.status);
    } catch (e) {
      console.error("[lead] webhook failed", e);
    }
  }

  if (process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO) {
    try {
      const text = Object.entries(lead)
        .map(([k, val]) => `${k}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join("\n");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEAD_EMAIL_FROM || "JK Speedy Website <onboarding@resend.dev>",
          to: process.env.LEAD_EMAIL_TO.split(",").map((s) => s.trim()),
          reply_to: lead.email || undefined,
          subject: `New lesson request: ${lead.name} (${lead.service})`,
          text,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      console.error("[lead] email responded", res.status);
    } catch (e) {
      console.error("[lead] email failed", e);
    }
  }

  if (!webhook && !process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production") {
    console.info("[lead] (dev, no delivery configured)", lead);
    return NextResponse.json({ ok: true, dev: true });
  }
  return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 503 });
}
