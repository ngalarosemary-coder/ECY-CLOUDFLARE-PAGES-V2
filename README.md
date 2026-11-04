# EL CARTEL DE YONG

Responsive digital storefront for **elcartelyong.com** with customer accounts, an authenticated admin dashboard, private APK/app and file catalogue, KES Paystack checkout, protected downloads, order management, email confirmations and customer support.

## Local development

Requirements: Node.js 22.5+ (built-in SQLite module).

```powershell
npm ci
Copy-Item .env.example .env
# Set a unique administrator password and rotated Paystack key in .env for local development.
npm run server
```

In another terminal run `npm run dev`, then open `http://localhost:3000`. Vite proxies `/api` to port 8787. SQLite and private uploaded files are stored under `DATA_DIR` (default `./data`); persist and back up the entire directory.

## Configuration

Set production variables in the hosting secret manager, never in source control or a deployment ZIP:

- `APP_URL`: public HTTPS origin, normally `https://elcartelyong.com`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: create the first administrator on first database start. Use a unique password of at least 12 characters; bootstrap values are used only if no administrator exists yet.
- `PAYSTACK_SECRET_KEY`: server-side Paystack key. Use a test key in test environments and a rotated live key for real transactions.
- `DATA_DIR`: persistent writable directory for SQLite and private product files (default `./data`). Do not mount it as public web content.
- `MAX_DIGITAL_FILE_MB`: maximum admin-uploaded file size, 1–1024 MB (default 250).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`: SMTP configuration for paid-order confirmation emails. Without all required SMTP settings, account downloads still work, while the admin dashboard marks the email failed and offers a retry after setup.
- `PORT`: HTTP listener (default 8787; Docker uses 8080).

Checkout requires a signed-in customer account, prices are recalculated on the server, and payment must be verified by Paystack for the exact KES amount before downloads are enabled. Files are stored outside the static web root and only served to the customer who owns a verified paid order. Configure the Paystack webhook at `https://elcartelyong.com/api/payments/webhook`; webhook signatures are verified. Never use test keys for live transactions.

## Verify and build

```powershell
npm run lint
npm test
npm run build
npm run build:server
```

## Docker deployment

The Dockerfile packages the frontend and Node API together. Mount persistent storage at `/app/data`; it contains both the database and digital product files.

```powershell
docker build -t el-cartel-de-yong .
docker run --rm -p 8080:8080 `
  -e APP_URL=https://elcartelyong.com `
  -e ADMIN_EMAIL=owner@elcartelyong.com `
  -e ADMIN_PASSWORD='REPLACE_WITH_A_UNIQUE_RANDOM_PASSWORD' `
  -e PAYSTACK_SECRET_KEY='REPLACE_WITH_ROTATED_SERVER_SECRET' `
  -e SMTP_HOST='smtp.example.com' `
  -e SMTP_PORT=587 `
  -e SMTP_USER='orders@elcartelyong.com' `
  -e SMTP_PASSWORD='SET_IN_HOST_SECRET_MANAGER' `
  -e SMTP_FROM='EL CARTEL DE YONG <orders@elcartelyong.com>' `
  -v elcartel-data:/app/data el-cartel-de-yong
```

Use the hosting provider's secret manager rather than literal credentials in shell history for production. Terminate TLS at the host or proxy and point the domain to the container. Connect DNS for `elcartelyong.com` and `www.elcartelyong.com` using the host's instructions.

## Launch notes

The project includes account download access and SMTP email retry/status tracking. Confirm SMTP delivery and persistent-volume backups before launch. The legal summaries are drafts, not legal advice; have qualified Kenyan counsel review business, privacy, tax, software licensing, consumer, refund and cancellation terms. Any administrator password or payment key previously shared in chat must be revoked and replaced before production.