#!/bin/bash

# Database Backup Script for Småjobb Production
# This script creates automated backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/opt/smajobb/backups"
DB_NAME="smajobb_production"
DB_USER="smajobb_user"
DB_HOST="localhost"
DB_PORT="5432"
RETENTION_DAYS=30
COMPRESSION_LEVEL=6

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create backup directory if it doesn't exist
create_backup_dir() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        chmod 755 "$BACKUP_DIR"
    fi
}

# Get database password from environment or prompt
get_db_password() {
    if [[ -n "$DB_PASSWORD" ]]; then
        echo "$DB_PASSWORD"
    else
        read -s -p "Enter database password for $DB_USER: " DB_PASSWORD
        echo
        if [[ -z "$DB_PASSWORD" ]]; then
            error "Database password is required"
            exit 1
        fi
        echo "$DB_PASSWORD"
    fi
}

# Create database backup
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${BACKUP_DIR}/smajobb_backup_${timestamp}.sql"
    local compressed_file="${backup_file}.gz"
    
    log "Creating database backup..."
    
    # Set password for pg_dump
    export PGPASSWORD=$(get_db_password)
    
    # Create backup
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose \
        --no-password \
        --format=custom \
        --compress="$COMPRESSION_LEVEL" \
        --file="$compressed_file"; then
        
        success "Database backup created: $compressed_file"
        
        # Get backup size
        local backup_size=$(du -h "$compressed_file" | cut -f1)
        log "Backup size: $backup_size"
        
        # Verify backup integrity
        if pg_restore --list "$compressed_file" > /dev/null 2>&1; then
            success "Backup integrity verified"
        else
            error "Backup integrity check failed"
            rm -f "$compressed_file"
            exit 1
        fi
        
        # Create a symlink to the latest backup
        ln -sf "$(basename "$compressed_file")" "${BACKUP_DIR}/latest_backup.sql.gz"
        
        return 0
    else
        error "Database backup failed"
        rm -f "$compressed_file"
        exit 1
    fi
}

# Clean up old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local deleted_count=0
    while IFS= read -r -d '' file; do
        rm -f "$file"
        ((deleted_count++))
    done < <(find "$BACKUP_DIR" -name "smajobb_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -print0)
    
    if [[ $deleted_count -gt 0 ]]; then
        success "Deleted $deleted_count old backup(s)"
    else
        log "No old backups to delete"
    fi
}

# List available backups
list_backups() {
    log "Available backups:"
    echo "=================="
    
    if [[ -d "$BACKUP_DIR" ]]; then
        ls -lah "$BACKUP_DIR"/smajobb_backup_*.sql.gz 2>/dev/null | while read -r line; do
            echo "$line"
        done
        
        local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
        echo "Total backup size: $total_size"
    else
        warning "No backup directory found"
    fi
}

# Restore from backup
restore_backup() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        error "Backup file path is required"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Restoring database from backup: $backup_file"
    
    # Confirm restore
    read -p "This will overwrite the current database. Are you sure? (yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
        log "Restore cancelled"
        exit 0
    fi
    
    # Set password for pg_restore
    export PGPASSWORD=$(get_db_password)
    
    # Drop and recreate database
    log "Dropping existing database..."
    dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" --if-exists "$DB_NAME"
    
    log "Creating new database..."
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    
    # Restore from backup
    log "Restoring database..."
    if pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose \
        --no-password \
        --clean \
        --if-exists \
        "$backup_file"; then
        
        success "Database restored successfully"
    else
        error "Database restore failed"
        exit 1
    fi
}

# Test backup integrity
test_backup() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        backup_file="${BACKUP_DIR}/latest_backup.sql.gz"
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Testing backup integrity: $backup_file"
    
    if pg_restore --list "$backup_file" > /dev/null 2>&1; then
        success "Backup integrity test passed"
        
        # Show backup contents
        log "Backup contents:"
        pg_restore --list "$backup_file" | head -20
        echo "..."
    else
        error "Backup integrity test failed"
        exit 1
    fi
}

# Send backup to remote storage (optional)
upload_backup() {
    local backup_file="$1"
    local remote_path="$2"
    
    if [[ -z "$backup_file" || -z "$remote_path" ]]; then
        error "Backup file and remote path are required"
        echo "Usage: $0 upload <backup_file> <remote_path>"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Uploading backup to remote storage..."
    
    # Example using rsync (adjust as needed)
    if command -v rsync &> /dev/null; then
        if rsync -avz --progress "$backup_file" "$remote_path"; then
            success "Backup uploaded successfully"
        else
            error "Backup upload failed"
            exit 1
        fi
    else
        error "rsync is not installed. Please install rsync or implement your preferred upload method."
        exit 1
    fi
}

# Main function
main() {
    case "${1:-backup}" in
        "backup")
            create_backup_dir
            create_backup
            cleanup_old_backups
            ;;
        "list")
            list_backups
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "test")
            test_backup "$2"
            ;;
        "upload")
            upload_backup "$2" "$3"
            ;;
        "cleanup")
            cleanup_old_backups
            ;;
        *)
            echo "Usage: $0 {backup|list|restore|test|upload|cleanup}"
            echo ""
            echo "Commands:"
            echo "  backup [file]     - Create database backup (default)"
            echo "  list              - List available backups"
            echo "  restore <file>    - Restore database from backup"
            echo "  test [file]       - Test backup integrity"
            echo "  upload <file> <remote> - Upload backup to remote storage"
            echo "  cleanup           - Clean up old backups"
            echo ""
            echo "Environment variables:"
            echo "  DB_PASSWORD       - Database password (optional, will prompt if not set)"
            echo "  BACKUP_DIR        - Backup directory (default: /opt/smajobb/backups)"
            echo "  RETENTION_DAYS    - Days to keep backups (default: 30)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
