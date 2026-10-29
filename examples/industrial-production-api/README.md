# Industrial Production API — Node.js, Express & MySQL

A standalone, **independently authored** portfolio demonstration of a production monitoring backend. All machine identifiers, sample records and operational metrics are **synthetic**. No customer systems, code or data are used.

## Architecture

```text
REST clients -> Express routes -> validation/business logic -> MySQL
                    |
                JSON responses
```

## Requirements
- Node.js 20+
- MySQL 8+

## Setup
1. Execute `database/schema.sql` and `database/seed.sql` in MySQL.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set **local demo** database credentials.
4. Run `npm start`.
5. Run `npm test` for automated tests (database-independent mocked tests).

## Endpoints
| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/api/machines` | List simulated machines |
| GET | `/api/production?limit=50` | Recent production records (1–100) |
| POST | `/api/production` | Add a simulated production event |
| GET | `/api/analytics` | Aggregated machine metrics |

Example POST JSON:
```json
{
  "machineId": 1,
  "occurredAt": "2026-01-10 10:00:00",
  "quantity": 120,
  "rejectedQuantity": 3
}
```

Example analytics response:
```json
[{
  "machine": "DEMO-LINE-01",
  "production": {"total": 255, "accepted": 250, "rejected": 5},
  "performance": {"rejectRate": 1.96, "efficiency": 98.04},
  "status": "SIMULATED"
}]
```

**Metric definition:** `efficiency` is the accepted-unit percentage, **not OEE**.

## Design and limitations
- SQL parameter binding, validation, structured routes and centralized error handling.
- `POST` is intentionally unauthenticated for local learning **only**. Do not expose this service to the public internet without authentication, authorization, rate limiting, HTTPS and operational hardening.
- Timestamps are supplied as MySQL `DATETIME` in a consistent demo convention. Real deployments should define explicit time zones.
- Tests use a fake database; an integration test against MySQL is not included.
- This is a portfolio demonstration, **not a deployed industrial production system**.

## Confidentiality
No real customer names, source code, plant data, PLC addresses, credentials or proprietary control logic are included.
