const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function addMejaAsalColumn() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  // Read existing database
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  try {
    // Add meja_asal column
    db.run('ALTER TABLE students ADD COLUMN meja_asal TEXT');
    console.log('✅ Added column: meja_asal');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('⚠️  Column meja_asal already exists, skipping...');
    } else {
      throw error;
    }
  }

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  fs.writeFileSync(dbPath, newBuffer);

  console.log('✅ Database updated successfully');
  db.close();
}

addMejaAsalColumn().catch(console.error);
