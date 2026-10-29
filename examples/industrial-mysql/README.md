# Industrial Production Database — MySQL 8+

A standalone SQL portfolio example for industrial production reporting. **All identifiers and records are synthetic.**

## Data model
- `machines`: generic simulated equipment registry.
- `production_events`: timestamped production and rejection counts.
- Foreign key, validation constraint, and composite index for machine/time queries.

## Run
Execute in order using a MySQL 8+ client:
1. `schema.sql`
2. `seed.sql` (run once; repeated runs add more events)
3. `analytics.sql`

The analytics query returns daily production, accepted units, rejected units, and rejection percentage per machine.

## Scope
Demonstration only. No customer database, industrial network, or proprietary process is represented.
