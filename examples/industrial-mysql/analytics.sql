USE sc_portfolio;
-- Production totals and reject rate by machine and calendar day.
SELECT
  m.machine_code,
  DATE(e.occurred_at) AS production_day,
  SUM(e.quantity) AS total_units,
  SUM(e.rejected_quantity) AS rejected_units,
  SUM(e.quantity - e.rejected_quantity) AS accepted_units,
  ROUND(100.0 * SUM(e.rejected_quantity) / NULLIF(SUM(e.quantity), 0), 2) AS reject_rate_pct
FROM production_events e
JOIN machines m ON m.id = e.machine_id
GROUP BY m.machine_code, DATE(e.occurred_at)
ORDER BY production_day DESC, m.machine_code;
