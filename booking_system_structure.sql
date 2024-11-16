-- Create users table with GDPR considerations
CREATE TABLE abc123_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('reserver', 'administrator')) NOT NULL, 
    age INT CHECK (age >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pseudonym VARCHAR(100) UNIQUE NOT NULL, -- Pseudonym for privacy
    consent BOOLEAN NOT NULL, -- User consent for data processing
    data_retention_period INTERVAL NOT NULL DEFAULT INTERVAL '1 year' -- Data retention period
);

-- Create resources table
CREATE TABLE abc123_resources (
    resource_id SERIAL PRIMARY KEY,
    resource_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reservations table with pseudonymized user reference
CREATE TABLE abc123_reservations (
    reservation_id SERIAL PRIMARY KEY,
    pseudonym VARCHAR(100) REFERENCES abc123_users(pseudonym) ON DELETE CASCADE,
    resource_id INT REFERENCES abc123_resources(resource_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

-- Create a view for public access to reservations without showing user identity
CREATE VIEW abc123_public_reservations AS
SELECT
    r.resource_id,
    r.resource_name,
    res.start_time,
    res.end_time
FROM
    abc123_reservations res
JOIN
    abc123_resources r ON res.resource_id=r.resource_id;

-- Create audit logs table for accountability
CREATE TABLE abc123_audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES abc123_users(user_id),
    action VARCHAR(100) NOT NULL, 
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);