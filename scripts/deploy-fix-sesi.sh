#!/bin/bash

# Script to deploy sesi display fix to VPS
# Run this on VPS: bash scripts/deploy-fix-sesi.sh

echo "🚀 Deploying Sesi Display Fix..."
echo ""

# Navigate to project directory
cd /var/www/antrian-test || exit 1

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart antrian-test

# Show PM2 status
echo ""
echo "✅ Deployment complete!"
echo ""
pm2 status

echo ""
echo "📋 IMPORTANT: Clear browser cache!"
echo "   Press Ctrl+Shift+R in your browser to force refresh"
echo ""
echo "🔍 Verify the fix:"
echo "   - Check 'Daftar Siswa' page"
echo "   - Sesi badge should show: 'Sesi 1', 'Sesi 2', 'Sesi 3'"
echo "   - NOT 'Sesi sesi1', 'Sesi sesi2', 'Sesi sesi3'"
