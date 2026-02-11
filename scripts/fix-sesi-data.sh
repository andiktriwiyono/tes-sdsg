#!/bin/bash

# Script to fix sesi data format in database
# Normalizes all sesi values to: sesi1, sesi2, sesi3

DB_PATH="data/antrian.db"

echo "🔧 Memperbaiki format sesi di database..."
echo ""

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
  echo "❌ Database tidak ditemukan: $DB_PATH"
  exit 1
fi

# Backup database first
BACKUP_PATH="data/antrian.db.backup-$(date +%Y%m%d-%H%M%S)"
cp "$DB_PATH" "$BACKUP_PATH"
echo "💾 Backup dibuat: $BACKUP_PATH"
echo ""

# Count total students
TOTAL=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM students;")
echo "📊 Total siswa: $TOTAL"
echo ""

# Show current sesi values (unique)
echo "🔍 Format sesi yang ditemukan:"
sqlite3 "$DB_PATH" "SELECT DISTINCT sesi FROM students ORDER BY sesi;" | while read sesi; do
  count=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM students WHERE sesi='$sesi';")
  echo "   - '$sesi' ($count siswa)"
done
echo ""

# Update sesi values
echo "🔄 Memperbarui format sesi..."
echo ""

# Update various formats to normalized format
sqlite3 "$DB_PATH" <<EOF
-- Update "1", "2", "3" to "sesi1", "sesi2", "sesi3"
UPDATE students SET sesi = 'sesi1' WHERE sesi = '1';
UPDATE students SET sesi = 'sesi2' WHERE sesi = '2';
UPDATE students SET sesi = 'sesi3' WHERE sesi = '3';

-- Update "Sesi 1", "Sesi 2", "Sesi 3" to "sesi1", "sesi2", "sesi3"
UPDATE students SET sesi = 'sesi1' WHERE sesi LIKE '%1%' AND sesi != 'sesi1';
UPDATE students SET sesi = 'sesi2' WHERE sesi LIKE '%2%' AND sesi != 'sesi2';
UPDATE students SET sesi = 'sesi3' WHERE sesi LIKE '%3%' AND sesi != 'sesi3';

-- Update NULL or empty to auto-assign based on no_pendaftaran
UPDATE students SET sesi = 'sesi1' WHERE (sesi IS NULL OR sesi = '') AND CAST(no_pendaftaran AS INTEGER) BETWEEN 1 AND 35;
UPDATE students SET sesi = 'sesi2' WHERE (sesi IS NULL OR sesi = '') AND CAST(no_pendaftaran AS INTEGER) BETWEEN 36 AND 71;
UPDATE students SET sesi = 'sesi3' WHERE (sesi IS NULL OR sesi = '') AND CAST(no_pendaftaran AS INTEGER) BETWEEN 72 AND 106;

-- Default to sesi1 for any remaining NULL or empty
UPDATE students SET sesi = 'sesi1' WHERE sesi IS NULL OR sesi = '';
EOF

echo "✅ Selesai!"
echo ""

# Show updated sesi values
echo "📊 Format sesi setelah perbaikan:"
sqlite3 "$DB_PATH" "SELECT DISTINCT sesi FROM students ORDER BY sesi;" | while read sesi; do
  count=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM students WHERE sesi='$sesi';")
  echo "   - '$sesi' ($count siswa)"
done
echo ""

echo "🎯 Format sesi sekarang: sesi1, sesi2, sesi3"
echo "📱 Tampilan di browser: Sesi 1, Sesi 2, Sesi 3"
echo ""
echo "⚠️  Jangan lupa restart PM2: pm2 restart antrian-test"
echo "⚠️  Dan clear browser cache: Ctrl+Shift+R"
