const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/antrian.db');

async function checkData() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  console.log('=== CHECKING DATABASE DATA ===\n');

  // Check total students
  const totalResult = db.exec('SELECT COUNT(*) as total FROM students');
  const total = totalResult[0].values[0][0];
  console.log(`Total students: ${total}\n`);

  // Check sesi distribution
  console.log('=== SESI DISTRIBUTION ===');
  const sesiResult = db.exec('SELECT sesi, COUNT(*) as count FROM students GROUP BY sesi ORDER BY sesi');
  if (sesiResult.length > 0) {
    sesiResult[0].values.forEach(row => {
      console.log(`Sesi: ${row[0]} -> ${row[1]} students`);
    });
  }
  console.log('');

  // Check gender distribution
  console.log('=== GENDER DISTRIBUTION ===');
  const genderResult = db.exec('SELECT jenis_kelamin, COUNT(*) as count FROM students GROUP BY jenis_kelamin ORDER BY jenis_kelamin');
  if (genderResult.length > 0) {
    genderResult[0].values.forEach(row => {
      console.log(`Gender: "${row[0]}" -> ${row[1]} students`);
    });
  }
  console.log('');

  // Check test status distribution
  console.log('=== TEST STATUS DISTRIBUTION ===');
  const statusResult = db.exec('SELECT sudah_test, COUNT(*) as count FROM students GROUP BY sudah_test ORDER BY sudah_test');
  if (statusResult.length > 0) {
    statusResult[0].values.forEach(row => {
      const status = row[0] === 1 ? 'Sudah Test' : 'Belum Test';
      console.log(`${status} (${row[0]}) -> ${row[1]} students`);
    });
  }
  console.log('');

  // Check sample data for Sesi 1, Laki-laki, Belum Test
  console.log('=== SAMPLE: Sesi 1 + Laki-laki + Belum Test ===');
  const sampleResult = db.exec(`
    SELECT no_pendaftaran, nama_murid, sesi, jenis_kelamin, sudah_test 
    FROM students 
    WHERE sesi = 1 AND jenis_kelamin = 'Laki-laki' AND sudah_test = 0
    LIMIT 10
  `);
  if (sampleResult.length > 0 && sampleResult[0].values.length > 0) {
    console.log('Found students:');
    sampleResult[0].values.forEach(row => {
      console.log(`  - ${row[0]}: ${row[1]} | Sesi: ${row[2]} | Gender: "${row[3]}" | Test: ${row[4]}`);
    });
  } else {
    console.log('NO STUDENTS FOUND with this combination!');
    
    // Try alternative queries to find the issue
    console.log('\nTrying alternative queries...');
    
    // Check with sesi = 1 (number)
    const alt1 = db.exec(`
      SELECT COUNT(*) FROM students 
      WHERE sesi = 1 AND jenis_kelamin = 'Laki-laki' AND sudah_test = 0
    `);
    console.log(`Sesi=1 (number): ${alt1[0].values[0][0]} students`);
    
    // Check just sesi and gender
    const alt2 = db.exec(`
      SELECT COUNT(*) FROM students 
      WHERE sesi = 1 AND jenis_kelamin = 'Laki-laki'
    `);
    console.log(`Sesi=1 + Gender (no status filter): ${alt2[0].values[0][0]} students`);
    
    // Check for any non-zero sudah_test
    const alt3 = db.exec(`
      SELECT sudah_test, COUNT(*) FROM students 
      WHERE sesi = 1 AND jenis_kelamin = 'Laki-laki'
      GROUP BY sudah_test
    `);
    console.log('Status breakdown for Sesi 1 + Laki-laki:');
    if (alt3.length > 0) {
      alt3[0].values.forEach(row => {
        console.log(`  sudah_test=${row[0]}: ${row[1]} students`);
      });
    }
  }
  console.log('');

  // Show all unique values for debugging
  console.log('=== ALL UNIQUE SESI VALUES ===');
  const uniqueSesi = db.exec('SELECT DISTINCT sesi FROM students ORDER BY sesi');
  if (uniqueSesi.length > 0) {
    uniqueSesi[0].values.forEach(row => {
      console.log(`  - "${row[0]}" (type: ${typeof row[0]})`);
    });
  }
  console.log('');

  console.log('=== ALL UNIQUE GENDER VALUES ===');
  const uniqueGender = db.exec('SELECT DISTINCT jenis_kelamin FROM students ORDER BY jenis_kelamin');
  if (uniqueGender.length > 0) {
    uniqueGender[0].values.forEach(row => {
      console.log(`  - "${row[0]}"`);
    });
  }
  console.log('');

  console.log('=== ALL UNIQUE SUDAH_TEST VALUES ===');
  const uniqueTest = db.exec('SELECT DISTINCT sudah_test FROM students ORDER BY sudah_test');
  if (uniqueTest.length > 0) {
    uniqueTest[0].values.forEach(row => {
      console.log(`  - ${row[0]} (type: ${typeof row[0]})`);
    });
  }

  db.close();
}

checkData().catch(console.error);
