-- Production Database Initialization Script
-- This script sets up the production database with proper security and performance settings

-- Create database if it doesn't exist (this will be handled by POSTGRES_DB)
-- CREATE DATABASE smajobb_production;

-- Connect to the database
\c smajobb_production;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set timezone
SET timezone = 'UTC';

-- Create custom types
DO $$ BEGIN
    CREATE TYPE notification_priority AS ENUM ('Low', 'Normal', 'High', 'Urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Customer', 'Youth', 'Admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('Open', 'InProgress', 'Completed', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
-- These will be created when the application runs migrations, but we can pre-create some

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_location ON jobs USING GIST(location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_entity ON media(entity_type, entity_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_created_at ON media(created_at);

-- Create full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_search ON jobs USING GIN(to_tsvector('swedish', title || ' ' || description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_search ON users USING GIN(to_tsvector('swedish', first_name || ' ' || last_name));

-- Set up row-level security (RLS) policies
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create policies (these will be more specific based on your business logic)
-- Users can only see their own data
CREATE POLICY user_own_data ON users FOR ALL TO smajobb_user USING (id = current_setting('app.current_user_id'));

-- Jobs are visible to all authenticated users
CREATE POLICY job_visibility ON jobs FOR SELECT TO smajobb_user USING (true);
CREATE POLICY job_ownership ON jobs FOR ALL TO smajobb_user USING (customer_id = current_setting('app.current_user_id'));

-- Messages are only visible to sender and receiver
CREATE POLICY message_visibility ON messages FOR ALL TO smajobb_user 
    USING (sender_id = current_setting('app.current_user_id') OR receiver_id = current_setting('app.current_user_id'));

-- Notifications are only visible to the user they belong to
CREATE POLICY notification_ownership ON notifications FOR ALL TO smajobb_user 
    USING (user_id = current_setting('app.current_user_id'));

-- Media files are visible based on entity ownership
CREATE POLICY media_visibility ON media FOR SELECT TO smajobb_user USING (is_public = true OR uploaded_by = current_setting('app.current_user_id'));

-- Create a function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Delete old read notifications (older than 30 days)
    DELETE FROM notifications 
    WHERE is_read = true AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Delete old messages (older than 1 year)
    DELETE FROM messages 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';
    
    -- Delete old media files that are not associated with any entity
    DELETE FROM media 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days' 
    AND (entity_type IS NULL OR entity_id IS NULL);
END;
$$ LANGUAGE plpgsql;

-- Create a function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE (
    table_name text,
    row_count bigint,
    table_size text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO smajobb_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smajobb_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smajobb_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO smajobb_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO smajobb_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO smajobb_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO smajobb_user;

-- Create a backup user with read-only access
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'smajobb_backup') THEN
        CREATE ROLE smajobb_backup WITH LOGIN PASSWORD 'backup_password_change_this';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE smajobb_production TO smajobb_backup;
GRANT USAGE ON SCHEMA public TO smajobb_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO smajobb_backup;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO smajobb_backup;

-- Log the completion
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;
