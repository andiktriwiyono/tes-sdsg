const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function checkTeachers() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  console.log('👨‍🏫 Teachers Data:\n');

  const results = db.exec('SELECT * FROM teachers ORDER BY meja_number ASC, position ASC');
  
  if (results.length > 0) {
    results[0].values.forEach(row => {
      console.log(`ID: ${row[0]} | Meja ${row[1]} | ${row[2]} | Position ${row[3]}`);
    });
  }

  db.close();
}

checkTeachers().catch(console.error);
