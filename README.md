# Telegram Hosting Bot Dashboard

Vercel-ready control panel for managing a Telegram bot. Inspect the bot status, send test messages, and configure webhooks via a sleek Next.js dashboard. The `/api/webhook` endpoint ships with basic command responses so the bot is immediately usable once deployed.

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Telegram bot token (talk to [@BotFather](https://t.me/BotFather))

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to open the dashboard.

### Required Environment Variables

Set these before running `npm run dev` or deploying to Vercel:

- `TELEGRAM_BOT_TOKEN` – Bot token from BotFather.
- `TELEGRAM_WEBHOOK_SECRET` *(optional)* – When provided, Telegram must include the matching `x-telegram-bot-api-secret-token` header.

```bash
export TELEGRAM_BOT_TOKEN="123456:ABCDEF" # example
# export TELEGRAM_WEBHOOK_SECRET="super-secret"
```

## Available Scripts

- `npm run dev` – Start the local development server.
- `npm run build` – Create a production build (validated in CI).
- `npm start` – Serve the production build locally.
- `npm run lint` – Run ESLint with Next.js defaults.

## Features

- Live status check via `getMe` so you immediately know if the token is valid.
- Send test messages to chats or channels with optional Markdown/HTML parsing.
- Configure or delete webhooks (with secret token support) directly from the UI.
- Production webhook handler that responds to `/start`, `/help`, and `/host` commands.
- Fully typed Next.js 14 (App Router) stack ready for Vercel deployment.

## Deployment

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-c2e4a540
```

Point BotFather to `https://agentic-c2e4a540.vercel.app/api/webhook` after deployment. If you configured `TELEGRAM_WEBHOOK_SECRET`, add the same secret token in the BotFather webhook setup.

## Folder Structure

```
app/
  api/                # Route handlers (send messages, manage webhooks, status, incoming updates)
  components/         # Reusable client components (status card)
  globals.css         # Global styling
  layout.tsx          # Root layout
  page.tsx            # Dashboard UI
```

## Security Notes

- Never commit your `TELEGRAM_BOT_TOKEN` to source control.
- Use Vercel environment variables for production secrets.
- Configure `TELEGRAM_WEBHOOK_SECRET` to prevent spoofed webhook requests.

## License

MIT
