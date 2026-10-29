'use strict';
const http = require('node:http');

function telemetry(at = new Date()) {
  const minute = Math.floor(at.getTime() / 60000);
  const produced = 100 + (minute % 30);
  const rejected = minute % 4;
  return {
    machine: 'DEMO-LINE-01',
    timestamp: at.toISOString(),
    status: 'SIMULATED',
    produced,
    rejected,
    accepted: produced - rejected
  };
}

function createServer() {
  return http.createServer((req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'GET' && path === '/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'ok' }));
    }
    if (req.method === 'GET' && path === '/api/telemetry') {
      res.writeHead(200);
      return res.end(JSON.stringify(telemetry()));
    }
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => console.log('Demo listening on port ' + port));
}
module.exports = { telemetry, createServer };
