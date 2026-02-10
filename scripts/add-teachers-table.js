const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function addTeachersTable() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  // Read existing database
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  // Create teachers table
  db.run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meja_number INTEGER NOT NULL,
      teacher_name TEXT NOT NULL,
      position INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    )
  `);

  // Insert default teachers (2 guru per meja)
  const defaultTeachers = [
    // Meja 1
    { meja_number: 1, teacher_name: 'Guru 1A', position: 1 },
    { meja_number: 1, teacher_name: 'Guru 1B', position: 2 },
    // Meja 2
    { meja_number: 2, teacher_name: 'Guru 2A', position: 1 },
    { meja_number: 2, teacher_name: 'Guru 2B', position: 2 },
    // Meja 3
    { meja_number: 3, teacher_name: 'Guru 3A', position: 1 },
    { meja_number: 3, teacher_name: 'Guru 3B', position: 2 },
    // Meja 4
    { meja_number: 4, teacher_name: 'Guru 4A', position: 1 },
    { meja_number: 4, teacher_name: 'Guru 4B', position: 2 },
    // Meja 5
    { meja_number: 5, teacher_name: 'Guru 5A', position: 1 },
    { meja_number: 5, teacher_name: 'Guru 5B', position: 2 }
  ];

  const now = new Date().toISOString();
  
  for (const teacher of defaultTeachers) {
    try {
      db.run(
        'INSERT INTO teachers (meja_number, teacher_name, position, created_at) VALUES (?, ?, ?, ?)',
        [teacher.meja_number, teacher.teacher_name, teacher.position, now]
      );
      console.log(`✅ Added teacher: ${teacher.teacher_name} (Meja ${teacher.meja_number})`);
    } catch (error) {
      console.log(`⚠️  Teacher ${teacher.teacher_name} might already exist, skipping...`);
    }
  }

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  fs.writeFileSync(dbPath, newBuffer);

  console.log('✅ Teachers table created and default teachers added successfully');
  db.close();
}

addTeachersTable().catch(console.error);
