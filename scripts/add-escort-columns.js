const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function addEscortColumns() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Database file not found. Run init-db.js first.');
    return;
  }

  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  try {
    // Add new columns for escort system
    console.log('Adding menunggu_dijemput column...');
    db.run(`ALTER TABLE students ADD COLUMN menunggu_dijemput INTEGER DEFAULT 0`);
    
    console.log('Adding target_meja column...');
    db.run(`ALTER TABLE students ADD COLUMN target_meja TEXT`);
    
    console.log('✅ Columns added successfully');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('ℹ️ Columns already exist, skipping...');
    } else {
      console.error('❌ Error adding columns:', error.message);
    }
  }

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  fs.writeFileSync(dbPath, newBuffer);
  
  console.log('✅ Database updated successfully');
  db.close();
}

addEscortColumns().catch(console.error);
