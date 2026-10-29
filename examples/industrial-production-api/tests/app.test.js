'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createApp,parseLimit}=require('../src/app');
const {summarize}=require('../src/services/productionService');
test('analytics calculates correct percentages',()=>{
 assert.deepEqual(summarize({machine:'DEMO',total:100,accepted:98,rejected:2}).performance,{rejectRate:2,efficiency:98});
});
test('zero production does not divide by zero',()=>{
 assert.equal(summarize({machine:'DEMO',total:0,accepted:0,rejected:0}).performance.efficiency,0);
});
test('pagination rejects unsafe limits',()=>{
 assert.equal(parseLimit('101'),null);assert.equal(parseLimit('1 OR 1=1'),null);
});
test('GET /health and GET /api/analytics',async()=>{
 const db={execute:async()=>[[{machine:'DEMO-LINE-01',total:10,accepted:9,rejected:1}]]};
 const server=createApp(db).listen(0);
 try {
  await new Promise(resolve=>server.once('listening',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  const health=await fetch(base+'/health');
  assert.equal(health.status,200);
  assert.deepEqual(await health.json(),{status:'ok'});
  const analytics=await fetch(base+'/api/analytics');
  assert.equal(analytics.status,200);
  assert.equal((await analytics.json())[0].performance.rejectRate,10);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
