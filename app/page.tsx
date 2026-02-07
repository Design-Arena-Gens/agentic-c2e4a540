"use client";

import { FormEvent, useState } from "react";
import { StatusCard } from "./components/StatusCard";

type ApiResponse = {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
};

export default function Home() {
  const [sendState, setSendState] = useState<{ loading: boolean; message: string | null }>({
    loading: false,
    message: null
  });
  const [webhookState, setWebhookState] = useState<{ loading: boolean; message: string | null }>(
    {
      loading: false,
      message: null
    }
  );

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const chatId = String(formData.get("chatId") ?? "").trim();
    const text = String(formData.get("text") ?? "").trim();
    const parseMode = String(formData.get("parseMode") ?? "None");
    const disableNotification = formData.get("disableNotification") === "on";

    setSendState({ loading: true, message: null });

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, text, parseMode, disableNotification })
      });
      const data = (await res.json()) as ApiResponse;

      if (!data.ok) {
        throw new Error(data.error ?? "Unknown error");
      }

      setSendState({ loading: false, message: "Message delivered!" });
      event.currentTarget.reset();
    } catch (error) {
      setSendState({
        loading: false,
        message: error instanceof Error ? `Failed: ${error.message}` : "Failed to send"
      });
    }
  }

  async function handleWebhook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = String(formData.get("url") ?? "").trim();
    const secretToken = String(formData.get("secretToken") ?? "").trim() || undefined;
    const dropPendingUpdates = formData.get("dropPendingUpdates") === "on";

    setWebhookState({ loading: true, message: null });

    try {
      const res = await fetch("/api/set-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, secretToken, dropPendingUpdates })
      });
      const data = (await res.json()) as ApiResponse;

      if (!data.ok) {
        throw new Error(data.error ?? "Unknown error");
      }

      setWebhookState({ loading: false, message: "Webhook saved" });
    } catch (error) {
      setWebhookState({
        loading: false,
        message: error instanceof Error ? `Failed: ${error.message}` : "Failed to set webhook"
      });
    }
  }

  async function handleWebhookDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dropPendingUpdates = formData.get("dropPendingUpdates") === "on";

    setWebhookState({ loading: true, message: null });

    try {
      const res = await fetch("/api/set-webhook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropPendingUpdates })
      });
      const data = (await res.json()) as ApiResponse;

      if (!data.ok) {
        throw new Error(data.error ?? "Unknown error");
      }

      setWebhookState({ loading: false, message: "Webhook removed" });
    } catch (error) {
      setWebhookState({
        loading: false,
        message: error instanceof Error ? `Failed: ${error.message}` : "Failed to delete webhook"
      });
    }
  }

  return (
    <main>
      <h1>Telegram Hosting Bot</h1>
      <p>
        Deploy a production-ready Telegram bot control plane on Vercel. Configure webhooks, send
        test messages, and verify your bot token in one dashboard.
      </p>

      <StatusCard />

      <section>
        <h2>Send Test Message</h2>
        <form onSubmit={handleSendMessage}>
          <div>
            <label htmlFor="chatId">Chat ID</label>
            <input
              id="chatId"
              name="chatId"
              placeholder="e.g. 123456789 or @channelusername"
              required
            />
          </div>
          <div>
            <label htmlFor="text">Message</label>
            <textarea id="text" name="text" placeholder="Hello from Vercel" rows={3} required />
          </div>
          <div>
            <label htmlFor="parseMode">Parse Mode</label>
            <select id="parseMode" name="parseMode" defaultValue="None">
              <option value="None">Plain text</option>
              <option value="Markdown">Markdown</option>
              <option value="MarkdownV2">MarkdownV2</option>
              <option value="HTML">HTML</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" name="disableNotification" />
            Silent delivery
          </label>
          <button type="submit" disabled={sendState.loading}>
            {sendState.loading ? "Sending…" : "Send Message"}
          </button>
          {sendState.message && <pre>{sendState.message}</pre>}
        </form>
      </section>

      <section>
        <h2>Manage Webhook</h2>
        <form onSubmit={handleWebhook}>
          <div>
            <label htmlFor="url">Webhook URL</label>
            <input id="url" name="url" placeholder="https://your-domain.com/api/webhook" required />
          </div>
          <div>
            <label htmlFor="secretToken">Secret Token (optional)</label>
            <input id="secretToken" name="secretToken" placeholder="Recommended for security" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" name="dropPendingUpdates" />
            Drop pending updates
          </label>
          <button type="submit" disabled={webhookState.loading}>
            {webhookState.loading ? "Saving…" : "Save Webhook"}
          </button>
        </form>
        <form onSubmit={handleWebhookDelete} style={{ marginTop: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" name="dropPendingUpdates" />
            Drop pending updates
          </label>
          <button type="submit" disabled={webhookState.loading}>
            {webhookState.loading ? "Removing…" : "Remove Webhook"}
          </button>
        </form>
        {webhookState.message && <pre style={{ marginTop: "16px" }}>{webhookState.message}</pre>}
      </section>

      <section>
        <h2>Deployment Checklist</h2>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "rgba(226,232,240,0.85)" }}>
          <li>Set `TELEGRAM_BOT_TOKEN` and (optional) `TELEGRAM_WEBHOOK_SECRET` in Vercel env vars.</li>
          <li>
            Deploy with `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-c2e4a540`.
          </li>
          <li>Point Telegram webhook to `https://agentic-c2e4a540.vercel.app/api/webhook`.</li>
          <li>Verify with `/start` and `/help` commands inside Telegram.</li>
        </ol>
      </section>
    </main>
  );
}
