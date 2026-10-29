'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { telemetry, createServer } = require('./server');

test('telemetry is deterministic for a given time', () => {
  const date = new Date('2026-01-01T00:00:00Z');
  assert.deepEqual(telemetry(date), telemetry(date));
  assert.equal(telemetry(date).produced, telemetry(date).accepted + telemetry(date).rejected);
  assert.equal(telemetry(date).status, 'SIMULATED');
});

test('health endpoint returns 200', async () => {
  const server = createServer().listen(0);
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const response = await fetch('http://127.0.0.1:' + server.address().port + '/health');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  } finally {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
});
