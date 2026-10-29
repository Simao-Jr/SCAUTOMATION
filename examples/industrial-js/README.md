# Industrial Telemetry API — JavaScript / Node.js

An independently authored, dependency-free HTTP API that generates **synthetic** industrial telemetry.

## Requirements
Node.js 20 or newer.

## Run
```bash
npm start
```

Endpoints:
- `GET /health` — process health response.
- `GET /api/telemetry` — simulated production counters.

## Test
```bash
npm test
```

The example uses built-in Node.js modules only. No PLC, real equipment, database credentials, or customer environment is accessed.

## Design notes
The server and telemetry generator are exported for unit testing. Values are deterministic within each minute and are **not** measurements from a real production line.
