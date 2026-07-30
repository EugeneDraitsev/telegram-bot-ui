# Private realtime Telegram chat statistics

Next.js frontend for [`telegram-bot-app`](https://github.com/EugeneDraitsev/telegram-bot-app).
It shows live and historical chat activity over an authenticated WebSocket.
There is no public chat lookup: run `/s` inside a Telegram chat to receive a
short-lived link scoped to that chat.

![Deploy Latest Main](https://github.com/EugeneDraitsev/telegram-bot-ui/workflows/Deploy%20Latest%20Main/badge.svg)

![demo](.github/demo.gif)

## Configuration

Set `NEXT_PUBLIC_WEBSOCKET_URL` to the deployed API Gateway WebSocket URL. The
production endpoint is used as a fallback for the existing deployment.

## Development

```bash
bun install --frozen-lockfile
bun run dev
```

Quality checks:

```bash
bun run audit
bun run lint
bun run tsc
bun run test
bun run build
```
