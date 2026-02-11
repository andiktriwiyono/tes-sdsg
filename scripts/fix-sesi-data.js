const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');

console.log('🔧 Memperbaiki format sesi di database...\n');

let db;
try {
  db = new Database(dbPath);
} catch (err) {
  console.error('❌ Error opening database:', err.message);
  process.exit(1);
}

// Get all students
let rows;
try {
  rows = db.prepare('SELECT id, no_pendaftaran, nama_murid, sesi FROM students').all();
} catch (err) {
  console.error('❌ Error reading students:', err.message);
  db.close();
  process.exit(1);
}

console.log(`📊 Total siswa: ${rows.length}\n`);

let fixedCount = 0;
let alreadyCorrect = 0;
const updates = [];

rows.forEach(student => {
  const currentSesi = student.sesi || '';
  let normalizedSesi = '';

  // Extract number from various formats
  if (currentSesi) {
    const sesiStr = currentSesi.toString().toLowerCase().trim();
    const sesiMatch = sesiStr.match(/(\d+)/);
    
    if (sesiMatch) {
      const sesiNum = sesiMatch[1];
      if (['1', '2', '3'].includes(sesiNum)) {
        normalizedSesi = `sesi${sesiNum}`;
      }
    }
  }

  // Auto-assign based on no_pendaftaran if invalid
  if (!normalizedSesi) {
    const no = parseInt(student.no_pendaftaran);
    if (no >= 1 && no <= 35) normalizedSesi = 'sesi1';
    else if (no >= 36 && no <= 71) normalizedSesi = 'sesi2';
    else if (no >= 72 && no <= 106) normalizedSesi = 'sesi3';
    else normalizedSesi = 'sesi1'; // default
  }

  // Check if needs update
  if (currentSesi !== normalizedSesi) {
    updates.push({
      id: student.id,
      nama: student.nama_murid,
      old: currentSesi || '(kosong)',
      new: normalizedSesi
    });
    fixedCount++;
  } else {
    alreadyCorrect++;
  }
});

if (updates.length === 0) {
  console.log('✅ Semua data sesi sudah benar!\n');
  console.log(`📊 Ringkasan:`);
  console.log(`   - Total siswa: ${rows.length}`);
  console.log(`   - Sudah benar: ${alreadyCorrect}`);
  db.close();
  process.exit(0);
}

console.log(`🔍 Ditemukan ${fixedCount} siswa yang perlu diperbaiki:\n`);

// Show first 10 examples
updates.slice(0, 10).forEach((u, i) => {
  console.log(`   ${i + 1}. ${u.nama}`);
  console.log(`      Sebelum: "${u.old}" → Sesudah: "${u.new}"`);
});

if (updates.length > 10) {
  console.log(`   ... dan ${updates.length - 10} siswa lainnya\n`);
} else {
  console.log('');
}

// Update database
console.log('🔄 Memperbarui database...\n');

const stmt = db.prepare('UPDATE students SET sesi = ? WHERE id = ?');

try {
  const updateMany = db.transaction((updates) => {
    for (const update of updates) {
      stmt.run(update.new, update.id);
    }
  });
  
  updateMany(updates);
  
  console.log('✅ Selesai!\n');
  console.log(`📊 Ringkasan:`);
  console.log(`   - Total siswa: ${rows.length}`);
  console.log(`   - Diperbaiki: ${fixedCount}`);
  console.log(`   - Sudah benar: ${alreadyCorrect}`);
  console.log('');
  console.log('🎯 Format sesi sekarang: sesi1, sesi2, sesi3');
  console.log('📱 Tampilan di browser: Sesi 1, Sesi 2, Sesi 3');
  
} catch (err) {
  console.error('❌ Error updating database:', err.message);
  db.close();
  process.exit(1);
}

db.close();
