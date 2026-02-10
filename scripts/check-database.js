const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function checkDatabase() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Database file not found!');
    return;
  }
  
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  console.log('📊 Database Tables:\n');

  // Get all tables
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  
  if (tables.length > 0) {
    tables[0].values.forEach(([tableName]) => {
      console.log(`\n✅ Table: ${tableName}`);
      
      // Get table info
      const info = db.exec(`PRAGMA table_info(${tableName})`);
      if (info.length > 0) {
        console.log('   Columns:');
        info[0].values.forEach(col => {
          console.log(`   - ${col[1]} (${col[2]})`);
        });
      }
      
      // Get row count
      const count = db.exec(`SELECT COUNT(*) FROM ${tableName}`);
      if (count.length > 0) {
        console.log(`   Rows: ${count[0].values[0][0]}`);
      }
    });
  }

  db.close();
  console.log('\n✅ Database check complete!');
}

checkDatabase().catch(console.error);
