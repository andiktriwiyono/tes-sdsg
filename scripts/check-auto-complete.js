const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/antrian.db');

async function checkAutoComplete() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  console.log('=== CHECKING AUTO-COMPLETE ISSUE ===\n');

  // Check students at meja
  console.log('Students currently at meja:');
  const mejaResult = db.exec(`
    SELECT no_pendaftaran, nama_murid, lokasi, sudah_test, test_start_time, test_end_time
    FROM students 
    WHERE lokasi LIKE 'meja-%'
    ORDER BY lokasi
  `);
  
  if (mejaResult.length > 0 && mejaResult[0].values.length > 0) {
    mejaResult[0].values.forEach(row => {
      const status = row[3] === 1 ? 'SELESAI' : 'SEDANG TEST';
      console.log(`  ${row[1]} (${row[0]}) at ${row[2]} - Status: ${status}`);
      console.log(`    Start: ${row[4] || 'NULL'}, End: ${row[5] || 'NULL'}`);
    });
  } else {
    console.log('  No students at meja');
  }
  
  console.log('\nStudents with sudah_test=1 but still at meja (BUG):');
  const bugResult = db.exec(`
    SELECT no_pendaftaran, nama_murid, lokasi, test_start_time, test_end_time
    FROM students 
    WHERE lokasi LIKE 'meja-%' AND sudah_test = 1
  `);
  
  if (bugResult.length > 0 && bugResult[0].values.length > 0) {
    console.log('  FOUND BUG CASES:');
    bugResult[0].values.forEach(row => {
      console.log(`    ${row[1]} (${row[0]}) at ${row[2]}`);
    });
  } else {
    console.log('  No bug found - all students at meja have sudah_test=0');
  }

  db.close();
}

checkAutoComplete().catch(console.error);
