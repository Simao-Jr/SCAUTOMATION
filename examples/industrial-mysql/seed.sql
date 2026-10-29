-- All records below are synthetic.
USE sc_portfolio;
INSERT INTO machines (machine_code, description)
VALUES ('DEMO-LINE-01', 'Simulated production line')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO production_events (machine_id, occurred_at, quantity, rejected_quantity)
SELECT id, '2026-01-10 08:00:00', 120, 3 FROM machines WHERE machine_code = 'DEMO-LINE-01';
INSERT INTO production_events (machine_id, occurred_at, quantity, rejected_quantity)
SELECT id, '2026-01-10 09:00:00', 135, 2 FROM machines WHERE machine_code = 'DEMO-LINE-01';
INSERT INTO production_events (machine_id, occurred_at, quantity, rejected_quantity)
SELECT id, '2026-01-10 10:00:00', 110, 5 FROM machines WHERE machine_code = 'DEMO-LINE-01';
