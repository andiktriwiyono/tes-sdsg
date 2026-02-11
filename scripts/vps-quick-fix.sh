#!/bin/bash

# VPS Quick Fix Script
# Script untuk fix masalah API & login di VPS

echo "🔧 VPS Quick Fix - Starting..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📂 Current directory: $(pwd)"
echo ""

# Step 1: Install dependencies
echo "1️⃣  Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 2: Migrate database
echo "2️⃣  Migrating database..."
node scripts/migrate-db-vps.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database migrated${NC}"
else
    echo -e "${RED}❌ Failed to migrate database${NC}"
    exit 1
fi
echo ""

# Step 3: Set permissions
echo "3️⃣  Setting permissions..."
chmod 755 data
chmod 644 data/antrian.db
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Permissions set${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Failed to set permissions${NC}"
fi
echo ""

# Step 4: Check if PM2 is installed
echo "4️⃣  Checking PM2..."
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 is installed${NC}"
    
    # Restart PM2
    echo "   Restarting PM2..."
    pm2 restart antrian-test
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 restarted${NC}"
    else
        echo -e "${YELLOW}⚠️  PM2 restart failed, trying to start...${NC}"
        pm2 start ecosystem.config.js
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not installed${NC}"
    echo "   Install PM2: sudo npm install -g pm2"
fi
echo ""

# Step 5: Test API
echo "5️⃣  Testing API..."
sleep 2  # Wait for server to start
API_RESPONSE=$(curl -s http://localhost:3000/api/users)
if [[ $API_RESPONSE == *"username"* ]]; then
    echo -e "${GREEN}✅ API is working!${NC}"
    echo "   Response: ${API_RESPONSE:0:100}..."
else
    echo -e "${RED}❌ API not working${NC}"
    echo "   Response: ${API_RESPONSE:0:200}"
fi
echo ""

# Step 6: Show PM2 status
echo "6️⃣  PM2 Status:"
if command -v pm2 &> /dev/null; then
    pm2 status
else
    echo -e "${YELLOW}⚠️  PM2 not installed${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Dependencies installed"
echo "✅ Database migrated"
echo "✅ Permissions set"
echo ""
echo "🔐 Default Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🌐 Test your application:"
echo "   http://tes.sdsunangiri.sch.id"
echo ""
echo "📊 Check logs:"
echo "   pm2 logs antrian-test"
echo ""
echo "🔧 If still not working:"
echo "   1. Check PM2 logs: pm2 logs antrian-test"
echo "   2. Check Nginx: sudo systemctl status nginx"
echo "   3. Restart Nginx: sudo systemctl restart nginx"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 Quick Fix Complete!${NC}"
