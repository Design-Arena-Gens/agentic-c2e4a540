import { NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
  }
  return token;
}

export async function GET() {
  try {
    const token = getToken();
    const response = await fetch(`${TELEGRAM_API}/bot${token}/getMe`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json({ ok: false, error: body || "Unable to fetch bot info" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, info: data.result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error"
      },
      { status: 500 }
    );
  }
}
