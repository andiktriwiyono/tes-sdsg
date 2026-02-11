#!/bin/bash

# Script to check and fix sesi data format in database

DB_PATH="data/antrian.db"

echo "🔍 Memeriksa format sesi di database..."
echo ""

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
  echo "❌ Database tidak ditemukan: $DB_PATH"
  exit 1
fi

# Show current sesi values with examples
echo "📊 Format sesi yang ditemukan:"
echo ""

sqlite3 "$DB_PATH" "SELECT DISTINCT sesi FROM students ORDER BY sesi;" | while read sesi; do
  count=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM students WHERE sesi='$sesi';")
  echo "Format: '$sesi' ($count siswa)"
  
  # Show 2 examples
  echo "  Contoh siswa:"
  sqlite3 "$DB_PATH" "SELECT '  - ' || no_pendaftaran || ': ' || nama_murid FROM students WHERE sesi='$sesi' LIMIT 2;"
  echo ""
done

echo "❓ Apakah format sesi sudah benar (sesi1, sesi2, sesi3)?"
echo ""
read -p "Perbaiki format sesi? (y/n): " confirm

if [ "$confirm" != "y" ]; then
  echo "Dibatalkan."
  exit 0
fi

# Backup database first
BACKUP_PATH="data/antrian.db.backup-$(date +%Y%m%d-%H%M%S)"
cp "$DB_PATH" "$BACKUP_PATH"
echo ""
echo "💾 Backup dibuat: $BACKUP_PATH"
echo ""

# Update sesi values
echo "🔄 Memperbarui format sesi..."
echo ""

sqlite3 "$DB_PATH" <<EOF
-- Update berbagai format ke format standar
UPDATE students SET sesi = 'sesi1' WHERE sesi IN ('1', 'Sesi 1', 'Sesi1', 'SESI1', 'sesi 1');
UPDATE students SET sesi = 'sesi2' WHERE sesi IN ('2', 'Sesi 2', 'Sesi2', 'SESI2', 'sesi 2');
UPDATE students SET sesi = 'sesi3' WHERE sesi IN ('3', 'Sesi 3', 'Sesi3', 'SESI3', 'sesi 3');

-- Update yang mengandung angka 1, 2, 3 tapi belum standar
UPDATE students SET sesi = 'sesi1' WHERE sesi LIKE '%1%' AND sesi NOT IN ('sesi1', 'sesi2', 'sesi3');
UPDATE students SET sesi = 'sesi2' WHERE sesi LIKE '%2%' AND sesi NOT IN ('sesi1', 'sesi2', 'sesi3');
UPDATE students SET sesi = 'sesi3' WHERE sesi LIKE '%3%' AND sesi NOT IN ('sesi1', 'sesi2', 'sesi3');

-- Auto-assign berdasarkan no_pendaftaran untuk yang NULL atau kosong
UPDATE students SET sesi = 'sesi1' WHERE (sesi IS NULL OR sesi = '' OR sesi NOT IN ('sesi1', 'sesi2', 'sesi3')) AND CAST(no_pendaftaran AS INTEGER) BETWEEN 1 AND 35;
UPDATE students SET sesi = 'sesi2' WHERE (sesi IS NULL OR sesi = '' OR sesi NOT IN ('sesi1', 'sesi2', 'sesi3')) AND CAST(no_pendaftaran AS INTEGER) BETWEEN 36 AND 71;
UPDATE students SET sesi = 'sesi3' WHERE (sesi IS NULL OR sesi = '' OR sesi NOT IN ('sesi1', 'sesi2', 'sesi3')) AND CAST(no_pendaftaran AS INTEGER) BETWEEN 72 AND 106;

-- Default ke sesi1 untuk sisanya
UPDATE students SET sesi = 'sesi1' WHERE sesi IS NULL OR sesi = '' OR sesi NOT IN ('sesi1', 'sesi2', 'sesi3');
EOF

echo "✅ Selesai!"
echo ""

# Show updated sesi values
echo "📊 Format sesi setelah perbaikan:"
echo ""

sqlite3 "$DB_PATH" "SELECT DISTINCT sesi FROM students ORDER BY sesi;" | while read sesi; do
  count=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM students WHERE sesi='$sesi';")
  echo "Format: '$sesi' ($count siswa)"
  
  # Show 2 examples
  echo "  Contoh siswa:"
  sqlite3 "$DB_PATH" "SELECT '  - ' || no_pendaftaran || ': ' || nama_murid FROM students WHERE sesi='$sesi' LIMIT 2;"
  echo ""
done

echo "🎯 Format sesi sekarang: sesi1, sesi2, sesi3"
echo "📱 Tampilan di browser: Sesi 1, Sesi 2, Sesi 3"
echo ""
echo "⚠️  Jangan lupa:"
echo "   1. Restart PM2: pm2 restart antrian-test"
echo "   2. Clear browser cache: Ctrl+Shift+R"
