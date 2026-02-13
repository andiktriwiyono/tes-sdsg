const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');

console.log('🔧 Menambahkan kolom is_break ke tabel teachers...\n');

async function addBreakColumn() {
  try {
    const SQL = await initSqlJs();
    const buffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(buffer);
    
    // Check if column already exists
    const tableInfo = db.exec("PRAGMA table_info(teachers)");
    let hasBreakColumn = false;
    
    if (tableInfo.length > 0) {
      hasBreakColumn = tableInfo[0].values.some(col => col[1] === 'is_break');
    }
    
    if (hasBreakColumn) {
      console.log('✅ Kolom is_break sudah ada');
    } else {
      // Add is_break column (0 = aktif, 1 = istirahat)
      db.run('ALTER TABLE teachers ADD COLUMN is_break INTEGER DEFAULT 0');
      console.log('✅ Kolom is_break berhasil ditambahkan');
      
      // Save database
      const data = db.export();
      const bufferOut = Buffer.from(data);
      fs.writeFileSync(dbPath, bufferOut);
    }
    
    // Show current teachers status
    const teachers = db.exec('SELECT meja_number, teacher_name, is_break FROM teachers ORDER BY meja_number');
    
    console.log('\n📊 Status Meja Penguji:');
    if (teachers.length > 0 && teachers[0].values.length > 0) {
      const mejaGroups = {};
      teachers[0].values.forEach(row => {
        const meja = row[0];
        if (!mejaGroups[meja]) {
          mejaGroups[meja] = [];
        }
        mejaGroups[meja].push({
          meja_number: row[0],
          teacher_name: row[1],
          is_break: row[2]
        });
      });
      
      Object.keys(mejaGroups).sort().forEach(meja => {
        const teachersList = mejaGroups[meja];
        const status = teachersList[0].is_break === 1 ? '🛑 Istirahat' : '✅ Aktif';
        const names = teachersList.map(t => t.teacher_name).join(' & ');
        console.log(`   Meja ${meja}: ${names} - ${status}`);
      });
    }
    
    db.close();
    
    console.log('\n✅ Selesai!');
    console.log('📝 Kolom is_break: 0 = Aktif, 1 = Istirahat');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addBreakColumn();
