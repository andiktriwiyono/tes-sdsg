const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function addPlotMejaColumn() {
  try {
    const SQL = await initSqlJs();
    const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
    
    if (!fs.existsSync(dbPath)) {
      console.error('❌ Database tidak ditemukan!');
      return;
    }

    const buffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(buffer);

    console.log('🔧 Menambahkan kolom plot_meja dan status_antar ke tabel students...');

    // Check if columns already exist
    const tableInfo = db.exec("PRAGMA table_info(students)");
    const columns = tableInfo[0]?.values.map(row => row[1]) || [];
    
    if (!columns.includes('plot_meja')) {
      db.run("ALTER TABLE students ADD COLUMN plot_meja TEXT DEFAULT NULL");
      console.log('✅ Kolom plot_meja berhasil ditambahkan');
    } else {
      console.log('ℹ️  Kolom plot_meja sudah ada');
    }

    if (!columns.includes('status_antar')) {
      db.run("ALTER TABLE students ADD COLUMN status_antar TEXT DEFAULT NULL");
      console.log('✅ Kolom status_antar berhasil ditambahkan');
    } else {
      console.log('ℹ️  Kolom status_antar sudah ada');
    }

    // Save database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    db.close();

    console.log('✅ Migrasi database selesai!');
    console.log('\nKolom baru:');
    console.log('- plot_meja: Meja yang di-plot oleh koordinator (meja-1, meja-2, dll)');
    console.log('- status_antar: Status siswa (menunggu-antar, menunggu-jemput, dll)');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPlotMejaColumn();
