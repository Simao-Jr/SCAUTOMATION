'use strict';
const db=require('./config/database');
const {createApp}=require('./app');
const port=Number(process.env.PORT||3000);
createApp(db).listen(port,()=>console.log('Industrial demo API listening on port '+port));
