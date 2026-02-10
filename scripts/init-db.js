const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function initDb() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

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

  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(dbDir, 'antrian.db'), buffer);

  console.log('✅ Database initialized successfully');
  db.close();
}

initDb().catch(console.error);
