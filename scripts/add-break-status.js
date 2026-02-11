const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');

console.log('🔧 Menambahkan kolom is_break ke tabel teachers...\n');

try {
  const db = new Database(dbPath);
  
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(teachers)").all();
  const hasBreakColumn = tableInfo.some(col => col.name === 'is_break');
  
  if (hasBreakColumn) {
    console.log('✅ Kolom is_break sudah ada');
  } else {
    // Add is_break column (0 = aktif, 1 = istirahat)
    db.prepare('ALTER TABLE teachers ADD COLUMN is_break INTEGER DEFAULT 0').run();
    console.log('✅ Kolom is_break berhasil ditambahkan');
  }
  
  // Show current teachers status
  const teachers = db.prepare('SELECT meja_number, teacher_name, is_break FROM teachers ORDER BY meja_number').all();
  
  console.log('\n📊 Status Meja Penguji:');
  const mejaGroups = {};
  teachers.forEach(t => {
    if (!mejaGroups[t.meja_number]) {
      mejaGroups[t.meja_number] = [];
    }
    mejaGroups[t.meja_number].push(t);
  });
  
  Object.keys(mejaGroups).sort().forEach(meja => {
    const teachers = mejaGroups[meja];
    const status = teachers[0].is_break === 1 ? '🛑 Istirahat' : '✅ Aktif';
    const names = teachers.map(t => t.teacher_name).join(' & ');
    console.log(`   Meja ${meja}: ${names} - ${status}`);
  });
  
  db.close();
  
  console.log('\n✅ Selesai!');
  console.log('📝 Kolom is_break: 0 = Aktif, 1 = Istirahat');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
