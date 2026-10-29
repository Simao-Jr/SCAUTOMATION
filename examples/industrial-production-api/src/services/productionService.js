'use strict';
function summarize(row) {
 const total=Number(row.total), accepted=Number(row.accepted), rejected=Number(row.rejected);
 return {
  machine: row.machine,
  production: {total,accepted,rejected},
  performance: {
   rejectRate: total ? Number((100*rejected/total).toFixed(2)) : 0,
   efficiency: total ? Number((100*accepted/total).toFixed(2)) : 0
  },
  status:'SIMULATED'
 };
}
module.exports={summarize};
