# Wayve Mock API

A small Express REST API for the Wayve Microfinance Bank React Native assessment. It uses fictional data and simulates transfers; it is not connected to a real bank and must not be used for real financial activity.

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
npm run dev        # tsx watch mode
npm run build      # compile TypeScript to dist/
npm start          # run the compiled build
npm run typecheck  # type-check without emitting
```

## Project structure
```
src/
├── server.ts            # entry point (starts the HTTP server)
├── app.ts               # Express app: CORS, JSON body, root/health, routers, error handler
├── config.ts            # env config, simulated latencies, transfer rules
├── types/               # shared domain types
├── data/
│   ├── seed.ts          # fictional account, banks, account names, transactions
│   └── store.ts         # in-memory state (resets on restart)
├── services/            # business logic (bank, transaction, transfer)
├── routes/              # one router per resource, mounted under /api/v1
├── middleware/          # async handler, X-Mock-Scenario handling, error handler
└── utils/               # ApiError and small helpers
```
Base URL: `http://localhost:4000`  
Health check: `http://localhost:4000/health`

For a physical phone, `localhost` refers to the phone itself. Use your computer's LAN IP (for example `http://192.168.1.20:4000`) while both devices are on the same Wi-Fi, or deploy the service and use its HTTPS URL.

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/v1/account` | Account overview |
| GET | `/api/v1/banks` | Mock bank list |
| GET | `/api/v1/transactions?page=1&limit=20` | Search/filter/paginate transactions |
| GET | `/api/v1/transactions/:id` | Transaction details |
| POST | `/api/v1/transfers/resolve-account` | Simulated account enquiry |
| POST | `/api/v1/transfers` | Simulated transfer |
| GET | `/api/v1/transfers/:id/status` | Retrieve transfer status |
| POST | `/api/v1/mock/transfers/:id/status` | Demo-only pending-status transition |

### Transactions query parameters
- `page` (default 1)
- `limit` (default 20, maximum 100)
- `search` (description, reference, sender, recipient)
- `type` (`credit` or `debit`)
- `status` (`successful`, `pending`, `failed`, `reversed`)
- `from` and `to` (ISO date strings)

Filters can be combined.

### Account enquiry request
```json
{
  "bankCode": "000002",
  "accountNumber": "0123456789"
}
```

### Transfer request
Send a new unique `idempotencyKey` for a new user-intended transfer. Reuse that exact key when retrying the same transfer after a timeout.
```json
{
  "recipientBankCode": "000002",
  "recipientAccountNumber": "1234567890",
  "amountMinor": 1000000,
  "narration": "Personal transfer",
  "idempotencyKey": "transfer-attempt-unique-id"
}
```
`amountMinor` is an integer in kobo: `1000000` means ₦10,000.00.

### Test scenarios
Pass `X-Mock-Scenario` as a request header:
- `slow` on account/transactions/transaction details: slow response.
- `error` on account/transactions: simulated 503.
- `reject` on transfer: explicit 422 rejection.
- `pending` on transfer: accepted transfer remains pending.
- `unknown` on transfer: accepted transfer remains pending (client can treat a client-side timeout as unknown and check status).
- `timeout` on transfer: server stores transfer then delays its response for 8 seconds; use a shorter client timeout to test unknown outcomes.
- omit the header or use `success` for a successful transfer.

To transition a pending transfer, call:
```http
POST /api/v1/mock/transfers/{transactionId}/status
Content-Type: application/json

{"status":"successful"}
```
Allowed final statuses: `successful`, `failed`, `reversed`.

## Deploy free on Render
1. Create a GitHub repository and upload this folder's contents.
2. Sign in to Render and choose **New + → Blueprint** (or create a Web Service).
3. Connect the repository. Render detects `render.yaml`; confirm the free instance.
4. Wait for deployment. Render will assign a public URL similar to `https://your-service-name.onrender.com` (the actual name/URL is assigned by Render).
5. Test `https://YOUR-RENDER-URL/health`.
6. Set the React Native API base URL to that exact HTTPS URL.

The deployed URL cannot be known until Render creates the service. Free web services may sleep when idle and take time to wake. In-memory demo data resets when the process restarts/redeploys; this is expected for an assessment mock API.

## Important limitations
- In-memory state only; data is not durable across restarts.
- No authentication or real bank connectivity.
- Mock idempotency is for assessment demonstrations only and is not a production financial guarantee.
- The mock balance update is simplified; review transaction lifecycle semantics before extending it.
- Do not use real customer data, real account credentials, or real transfers.
