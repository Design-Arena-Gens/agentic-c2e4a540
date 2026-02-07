import { NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

interface SendMessageBody {
  chatId: string;
  text: string;
  parseMode?: "MarkdownV2" | "HTML" | "Markdown" | "None";
  disableNotification?: boolean;
}

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
  }
  return token;
}

function normalizeParseMode(mode?: string) {
  if (!mode || mode === "None") return undefined;
  if (["Markdown", "MarkdownV2", "HTML"].includes(mode)) return mode;
  return undefined;
}

export async function POST(request: Request) {
  try {
    const token = getToken();
    const body = (await request.json()) as SendMessageBody;

    if (!body.chatId || !body.text) {
      return NextResponse.json({ ok: false, error: "chatId and text are required" }, { status: 400 });
    }

    const payload = {
      chat_id: body.chatId,
      text: body.text,
      parse_mode: normalizeParseMode(body.parseMode),
      disable_notification: body.disableNotification ?? false
    };

    const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return NextResponse.json({ ok: false, error: result.description ?? "Telegram API error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, messageId: result.result.message_id });
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
