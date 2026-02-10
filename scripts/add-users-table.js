const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function addUsersTable() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  // Read existing database
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    )
  `);

  // Insert default users
  const defaultUsers = [
    { username: 'admin', password: 'admin123', role: 'ADMIN', name: 'Administrator' },
    { username: 'posruang', password: 'posruang123', role: 'POS_RUANG', name: 'Pos Ruang' },
    { username: 'koordinator', password: 'koordinator123', role: 'KOORDINATOR_RUANG_TEST', name: 'Koordinator Ruang Test' },
    { username: 'petugasantar', password: 'petugasantar123', role: 'PETUGAS_ANTAR', name: 'Petugas Antar-Jemput' },
    { username: 'penguji1', password: 'penguji123', role: 'PENGUJI_MEJA_1', name: 'Penguji Meja 1' },
    { username: 'penguji2', password: 'penguji123', role: 'PENGUJI_MEJA_2', name: 'Penguji Meja 2' },
    { username: 'penguji3', password: 'penguji123', role: 'PENGUJI_MEJA_3', name: 'Penguji Meja 3' },
    { username: 'penguji4', password: 'penguji123', role: 'PENGUJI_MEJA_4', name: 'Penguji Meja 4' },
    { username: 'penguji5', password: 'penguji123', role: 'PENGUJI_MEJA_5', name: 'Penguji Meja 5' }
  ];

  const now = new Date().toISOString();
  
  for (const user of defaultUsers) {
    try {
      db.run(
        'INSERT INTO users (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)',
        [user.username, user.password, user.name, user.role, now]
      );
      console.log(`✅ Added user: ${user.username}`);
    } catch (error) {
      console.log(`⚠️  User ${user.username} already exists, skipping...`);
    }
  }

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  fs.writeFileSync(dbPath, newBuffer);

  console.log('✅ Users table created and default users added successfully');
  db.close();
}

addUsersTable().catch(console.error);
