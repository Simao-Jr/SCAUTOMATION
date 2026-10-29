'use strict';
const express = require('express');
const {summarize} = require('./services/productionService');
function createApp(db) {
 const app=express();
 app.disable('x-powered-by');
 app.use(express.json({limit:'16kb'}));
 app.get('/health',(_req,res)=>res.json({status:'ok'}));
 app.get('/api/machines',asyncHandler(async(_req,res)=>{
  const [rows]=await db.execute('SELECT id,machine_code,description FROM machines ORDER BY id');
  res.json(rows);
 }));
 app.get('/api/production',asyncHandler(async(req,res)=>{
  const limit=parseLimit(req.query.limit);
  if(limit===null) return res.status(400).json({error:'limit must be an integer between 1 and 100'});
  const [rows]=await db.query('SELECT id,machine_id,occurred_at,quantity,rejected_quantity FROM production_events ORDER BY occurred_at DESC,id DESC LIMIT ?', [limit]);
  res.json(rows);
 }));
 app.post('/api/production',asyncHandler(async(req,res)=>{
  const {machineId,quantity,rejectedQuantity=0,occurredAt}=req.body || {};
  if(!Number.isSafeInteger(machineId)||machineId<1||!Number.isSafeInteger(quantity)||quantity<0||quantity>2147483647||
     !Number.isSafeInteger(rejectedQuantity)||rejectedQuantity<0||rejectedQuantity>quantity||
     typeof occurredAt!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(occurredAt)||
     Number.isNaN(Date.parse(occurredAt.replace(' ','T')+'Z')))
    return res.status(400).json({error:'Invalid production payload'});
  const [result]=await db.execute(
   'INSERT INTO production_events(machine_id,occurred_at,quantity,rejected_quantity) VALUES(?,?,?,?)',
   [machineId,occurredAt,quantity,rejectedQuantity]);
  res.status(201).json({id:result.insertId,status:'SIMULATED'});
 }));
 app.get('/api/analytics',asyncHandler(async(_req,res)=>{
  const [rows]=await db.execute(`SELECT m.machine_code AS machine,
   COALESCE(SUM(e.quantity),0) AS total,
   COALESCE(SUM(e.quantity-e.rejected_quantity),0) AS accepted,
   COALESCE(SUM(e.rejected_quantity),0) AS rejected
   FROM machines m LEFT JOIN production_events e ON e.machine_id=m.id
   GROUP BY m.id,m.machine_code ORDER BY m.machine_code`);
  res.json(rows.map(summarize));
 }));
 app.use((_req,res)=>res.status(404).json({error:'Not found'}));
 app.use((err,_req,res,_next)=>{
  console.error('Request failed:',err.code || err.message);
  if(err.code==='ER_NO_REFERENCED_ROW_2') return res.status(400).json({error:'Unknown machineId'});
  res.status(500).json({error:'Internal server error'});
 });
 return app;
}
function asyncHandler(fn){return(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);}
function parseLimit(raw){
 if(raw===undefined)return 50;
 if(typeof raw!=='string'||!/^[0-9]+$/.test(raw))return null;
 const n=Number(raw);return Number.isInteger(n)&&n>=1&&n<=100?n:null;
}
module.exports={createApp,parseLimit};
