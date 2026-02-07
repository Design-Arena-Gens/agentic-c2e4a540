import { NextResponse } from "next/server";

type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    chat: {
      id: number;
      type: string;
      first_name?: string;
      username?: string;
    };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      username?: string;
      first_name?: string;
    };
    data?: string;
  };
};

async function relayToChat(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

export async function POST(request: Request) {
  const secretRequirement = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secretRequirement) {
    const header = request.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secretRequirement) {
      return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
    }
  }

  const update = (await request.json()) as TelegramUpdate;

  try {
    if (update.message?.text && update.message.text.trim().toLowerCase() === "/start") {
      await relayToChat(
        update.message.chat.id,
        "🤖 Hosting bot online! Send /help for available commands."
      );
    } else if (update.message?.text?.trim().toLowerCase() === "/help") {
      await relayToChat(
        update.message.chat.id,
        "Available commands:\n/start - check bot status\n/help - view help\n/host - instructions to deploy to Vercel"
      );
    } else if (update.message?.text?.trim().toLowerCase() === "/host") {
      await relayToChat(
        update.message.chat.id,
        "Deploy this bot by setting TELEGRAM_BOT_TOKEN on Vercel and pointing your webhook to /api/webhook."
      );
    }
  } catch (error) {
    console.error("Failed to process update", error);
  }

  return NextResponse.json({ ok: true });
}
