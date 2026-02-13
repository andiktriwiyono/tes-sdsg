const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/antrian.db');

async function fixPlotData() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  console.log('=== CHECKING PLOT DATA ISSUE ===\n');

  // Check students with plot_meja
  console.log('Students with plot_meja set:');
  const plottedResult = db.exec(`
    SELECT id, no_pendaftaran, nama_murid, lokasi, plot_meja, status_antar
    FROM students 
    WHERE plot_meja IS NOT NULL
    ORDER BY plot_meja
  `);
  
  if (plottedResult.length > 0 && plottedResult[0].values.length > 0) {
    console.log('Found students with plot_meja:');
    plottedResult[0].values.forEach(row => {
      console.log(`  ID ${row[0]}: ${row[2]} (${row[1]})`);
      console.log(`    Lokasi: ${row[3]}, Plot: ${row[4]}, Status Antar: ${row[5] || 'NULL'}`);
    });
    
    console.log('\n=== ANALYZING ISSUE ===');
    plottedResult[0].values.forEach(row => {
      const id = row[0];
      const lokasi = row[3];
      const plot_meja = row[4];
      
      // Check if student should still have plot_meja
      if (lokasi === 'test') {
        console.log(`  ✅ ID ${id}: OK - Student in Pool Test, plot_meja is valid`);
      } else if (lokasi.startsWith('meja-')) {
        console.log(`  ⚠️ ID ${id}: SHOULD CLEAR - Student already at ${lokasi}, plot_meja should be NULL`);
      } else if (lokasi === 'selesai-tunggu1' || lokasi === 'selesai-tunggu2') {
        console.log(`  ⚠️ ID ${id}: SHOULD CLEAR - Student finished test, plot_meja should be NULL`);
      } else {
        console.log(`  ⚠️ ID ${id}: SHOULD CLEAR - Student at ${lokasi}, plot_meja should be NULL`);
      }
    });
    
    // Ask for confirmation to fix
    console.log('\n=== FIXING DATA ===');
    console.log('Clearing plot_meja for students NOT in Pool Test...');
    
    // Clear plot_meja for students not in test pool
    db.run(`
      UPDATE students 
      SET plot_meja = NULL, status_antar = NULL
      WHERE plot_meja IS NOT NULL AND lokasi != 'test'
    `);
    
    // Save database
    const data = db.export();
    const bufferOut = Buffer.from(data);
    fs.writeFileSync(dbPath, bufferOut);
    
    console.log('✅ Fixed! plot_meja cleared for students not in Pool Test');
    
    // Show result
    const afterResult = db.exec(`
      SELECT id, no_pendaftaran, nama_murid, lokasi, plot_meja
      FROM students 
      WHERE plot_meja IS NOT NULL
    `);
    
    if (afterResult.length > 0 && afterResult[0].values.length > 0) {
      console.log('\nRemaining students with plot_meja (should only be in Pool Test):');
      afterResult[0].values.forEach(row => {
        console.log(`  ID ${row[0]}: ${row[2]} at ${row[3]}, plot: ${row[4]}`);
      });
    } else {
      console.log('\n✅ No students have plot_meja set (all cleared)');
    }
    
  } else {
    console.log('✅ No students have plot_meja set - data is clean');
  }
  
  // Check students at meja
  console.log('\n=== STUDENTS AT MEJA ===');
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
      console.log(`  ${row[1]} (${row[0]}) at ${row[2]} - Status: ${testStatus}`);
    });
  } else {
    console.log('No students at meja - all tables are empty');
  }

  db.close();
  console.log('\n✅ Done!');
}

fixPlotData().catch(console.error);
