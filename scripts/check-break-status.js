const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/antrian.db');

async function checkBreakStatus() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  console.log('=== CHECKING BREAK STATUS BUG ===\n');

  // Check all teachers and their break status
  console.log('Teachers break status:');
  const teachersResult = db.exec(`
    SELECT meja_number, teacher_name, is_break
    FROM teachers 
    ORDER BY meja_number
  `);
  
  if (teachersResult.length > 0 && teachersResult[0].values.length > 0) {
    teachersResult[0].values.forEach(row => {
      const breakStatus = row[2] === 1 ? '🛑 ISTIRAHAT' : '✅ AKTIF';
      console.log(`  Meja ${row[0]}: ${row[1]} - ${breakStatus} (is_break=${row[2]})`);
    });
  } else {
    console.log('  No teachers found in database');
  }
  
  console.log('\n=== CHECKING PLOTTED STUDENTS ===');
  const plottedResult = db.exec(`
    SELECT no_pendaftaran, nama_murid, lokasi, plot_meja, status_antar
    FROM students 
    WHERE plot_meja IS NOT NULL
    ORDER BY plot_meja
  `);
  
  if (plottedResult.length > 0 && plottedResult[0].values.length > 0) {
    console.log('Students that have been plotted:');
    plottedResult[0].values.forEach(row => {
      console.log(`  ${row[1]} (${row[0]}) - Lokasi: ${row[2]}, Plot: ${row[3]}, Status: ${row[4] || 'NULL'}`);
    });
  } else {
    console.log('No students have been plotted yet');
  }
  
  console.log('\n=== CHECKING STUDENTS AT MEJA ===');
  const mejaResult = db.exec(`
    SELECT no_pendaftaran, nama_murid, lokasi, meja_asal, sudah_test
    FROM students 
    WHERE lokasi LIKE 'meja-%'
    ORDER BY lokasi
  `);
  
  if (mejaResult.length > 0 && mejaResult[0].values.length > 0) {
    console.log('Students currently at meja:');
    mejaResult[0].values.forEach(row => {
      const testStatus = row[4] === 1 ? 'SELESAI' : 'SEDANG TEST';
      console.log(`  ${row[1]} (${row[0]}) at ${row[2]} - Meja Asal: ${row[3] || 'NULL'}, Status: ${testStatus}`);
    });
  } else {
    console.log('No students at meja');
  }
  
  console.log('\n=== CROSS-CHECK: Plotted to Break Tables ===');
  // Check if any student is plotted to a table that is on break
  const crossCheckResult = db.exec(`
    SELECT 
      s.no_pendaftaran, 
      s.nama_murid, 
      s.plot_meja,
      t.meja_number,
      t.teacher_name,
      t.is_break
    FROM students s
    LEFT JOIN teachers t ON CAST(REPLACE(s.plot_meja, 'meja-', '') AS INTEGER) = t.meja_number
    WHERE s.plot_meja IS NOT NULL
  `);
  
  if (crossCheckResult.length > 0 && crossCheckResult[0].values.length > 0) {
    let bugFound = false;
    crossCheckResult[0].values.forEach(row => {
      const isBreak = row[5] === 1;
      if (isBreak) {
        bugFound = true;
        console.log(`  ⚠️ BUG FOUND: ${row[1]} (${row[0]}) plotted to ${row[2]} but table is on BREAK!`);
        console.log(`     Teacher: ${row[4]}, is_break=${row[5]}`);
      } else {
        console.log(`  ✅ OK: ${row[1]} plotted to ${row[2]} - table is active`);
      }
    });
    
    if (!bugFound) {
      console.log('  No bugs found - all plotted students are assigned to active tables');
    }
  } else {
    console.log('  No plotted students to check');
  }

  db.close();
}

checkBreakStatus().catch(console.error);
