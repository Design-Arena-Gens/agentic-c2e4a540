"use client";

import { useEffect, useState } from "react";

interface StatusResponse {
  ok: boolean;
  info?: {
    username?: string;
    canJoinGroups?: boolean;
    canReadAllGroupMessages?: boolean;
    supportsInlineQueries?: boolean;
  };
  error?: string;
}

export function StatusCard() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/telegram-status");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as StatusResponse;
        if (!cancelled) {
          setStatus(data);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ ok: false, error: error instanceof Error ? error.message : "Unknown error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section>
        <h2>Bot Status</h2>
        <p>Checking connection…</p>
      </section>
    );
  }

  if (!status) {
    return null;
  }

  if (!status.ok) {
    return (
      <section>
        <h2>Bot Status</h2>
        <p>Unable to reach Telegram. Check your bot token.</p>
        {status.error && <pre>{status.error}</pre>}
      </section>
    );
  }

  return (
    <section>
      <h2>Bot Status</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px" }}>
        <li>
          <strong>Username</strong>: {status.info?.username ?? "–"}
        </li>
        <li>
          <strong>Can Join Groups</strong>: {status.info?.canJoinGroups ? "Yes" : "No"}
        </li>
        <li>
          <strong>Reads All Group Messages</strong>: {status.info?.canReadAllGroupMessages ? "Yes" : "No"}
        </li>
        <li>
          <strong>Supports Inline Queries</strong>: {status.info?.supportsInlineQueries ? "Yes" : "No"}
        </li>
      </ul>
    </section>
  );
}
