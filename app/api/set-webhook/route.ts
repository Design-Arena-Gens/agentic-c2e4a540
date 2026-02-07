import { NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
  }
  return token;
}

export async function POST(request: Request) {
  try {
    const token = getToken();
    const { url, secretToken, dropPendingUpdates } = (await request.json()) as {
      url: string;
      secretToken?: string;
      dropPendingUpdates?: boolean;
    };

    if (!url) {
      return NextResponse.json({ ok: false, error: "Webhook URL is required" }, { status: 400 });
    }

    const response = await fetch(`${TELEGRAM_API}/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        secret_token: secretToken,
        drop_pending_updates: dropPendingUpdates ?? false
      })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return NextResponse.json({ ok: false, error: result.description ?? "Telegram API error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
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

export async function DELETE(request: Request) {
  try {
    const token = getToken();
    const { dropPendingUpdates } = (await request.json().catch(() => ({}))) as {
      dropPendingUpdates?: boolean;
    };

    const response = await fetch(`${TELEGRAM_API}/bot${token}/deleteWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drop_pending_updates: dropPendingUpdates ?? false })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return NextResponse.json({ ok: false, error: result.description ?? "Telegram API error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
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
