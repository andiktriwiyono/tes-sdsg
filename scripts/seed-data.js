const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

async function seedDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  let db;
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no_pendaftaran TEXT NOT NULL,
        nama_murid TEXT NOT NULL,
        nama_orang_tua TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        lokasi TEXT DEFAULT 'daftar',
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    `);
  }

  // Seed sample data
  const sampleStudents = [
    { no_pendaftaran: '001', nama_murid: 'Ahmad Fauzi', nama_orang_tua: 'Budi Santoso', lokasi: 'daftar' },
    { no_pendaftaran: '002', nama_murid: 'Siti Nurhaliza', nama_orang_tua: 'Andi Wijaya', lokasi: 'daftar' },
    { no_pendaftaran: '003', nama_murid: 'Budi Setiawan', nama_orang_tua: 'Hendra Gunawan', lokasi: 'tunggu1' },
    { no_pendaftaran: '004', nama_murid: 'Dewi Lestari', nama_orang_tua: 'Slamet Riyadi', lokasi: 'tunggu2' },
    { no_pendaftaran: '005', nama_murid: 'Eko Prasetyo', nama_orang_tua: 'Bambang Sutrisno', lokasi: 'test' }
  ];

  sampleStudents.forEach(student => {
    db.run(`
      INSERT INTO students (no_pendaftaran, nama_murid, nama_orang_tua, status, lokasi, created_at)
      VALUES (?, ?, ?, 'active', ?, ?)
    `, [
      student.no_pendaftaran,
      student.nama_murid,
      student.nama_orang_tua,
      student.lokasi,
      new Date().toISOString()
    ]);
  });

  const result = db.exec('SELECT COUNT(*) as count FROM students');
  console.log('✅ Database seeded with sample data');
  console.log(`📊 Total students: ${result[0].values[0][0]}`);

  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);

  db.close();
}

seedDb().catch(console.error);
