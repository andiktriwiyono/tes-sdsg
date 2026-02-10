#!/bin/bash

# Setup Automatic Database Backup with Crontab
# This script will setup daily backup at 2 AM

echo "🔧 Setting up automatic database backup..."
echo ""

# Make backup script executable
chmod +x /var/www/antrian-test/backup-db.sh

# Create backup directory
mkdir -p /var/www/antrian-test/backups

# Add cron job (backup every day at 2 AM)
CRON_JOB="0 2 * * * /var/www/antrian-test/backup-db.sh >> /var/www/antrian-test/backups/backup.log 2>&1"

# Check if cron job already exists
(crontab -l 2>/dev/null | grep -F "$CRON_JOB") && echo "⚠️  Cron job already exists" || (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Automatic backup configured!"
echo "📅 Backup will run every day at 2:00 AM"
echo "📁 Backups location: /var/www/antrian-test/backups/"
echo "📝 Backup logs: /var/www/antrian-test/backups/backup.log"
echo ""
echo "To view current cron jobs:"
echo "  crontab -l"
echo ""
echo "To test backup manually:"
echo "  /var/www/antrian-test/backup-db.sh"
