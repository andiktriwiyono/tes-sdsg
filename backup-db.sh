#!/bin/bash

# Database Backup Script
# Usage: ./backup-db.sh

DB_PATH="/var/www/antrian-test/data/antrian.db"
BACKUP_DIR="/var/www/antrian-test/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/antrian_backup_$DATE.db"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup database
if [ -f "$DB_PATH" ]; then
    cp $DB_PATH $BACKUP_FILE
    echo "✅ Backup created: $BACKUP_FILE"
    
    # Keep only last 7 days of backups
    find $BACKUP_DIR -name "antrian_backup_*.db" -mtime +7 -delete
    echo "🗑️  Old backups cleaned (kept last 7 days)"
    
    # Show backup size
    SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "📦 Backup size: $SIZE"
else
    echo "❌ Database not found: $DB_PATH"
    exit 1
fi
