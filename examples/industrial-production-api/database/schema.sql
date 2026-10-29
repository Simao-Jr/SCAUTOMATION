CREATE DATABASE IF NOT EXISTS sc_portfolio;
USE sc_portfolio;
CREATE TABLE IF NOT EXISTS machines (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 machine_code VARCHAR(32) NOT NULL UNIQUE,
 description VARCHAR(120) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS production_events (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 machine_id BIGINT UNSIGNED NOT NULL,
 occurred_at DATETIME NOT NULL,
 quantity INT UNSIGNED NOT NULL,
 rejected_quantity INT UNSIGNED NOT NULL DEFAULT 0,
 CONSTRAINT fk_events_machine FOREIGN KEY (machine_id) REFERENCES machines(id),
 CONSTRAINT chk_rejected CHECK (rejected_quantity <= quantity),
 INDEX idx_events_machine_time (machine_id, occurred_at)
) ENGINE=InnoDB;
