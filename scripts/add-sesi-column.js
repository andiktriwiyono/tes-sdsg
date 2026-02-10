const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function addSesiColumn() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  
  // Read existing database
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  try {
    // Add sesi column
    db.run('ALTER TABLE students ADD COLUMN sesi INTEGER DEFAULT 1');
    console.log('✅ Added column: sesi');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('⚠️  Column sesi already exists, skipping...');
    } else {
      throw error;
    }
  }

  // Auto-assign sesi based on no_pendaftaran (FIXED RANGES)
  console.log('\n📊 Auto-assigning sesi based on registration number...');
  console.log('   Sesi 1: No. Pendaftaran 1-35');
  console.log('   Sesi 2: No. Pendaftaran 36-71');
  console.log('   Sesi 3: No. Pendaftaran 72-106');
  
  const results = db.exec('SELECT id, no_pendaftaran FROM students ORDER BY no_pendaftaran ASC');
  
  if (results.length > 0) {
    const students = results[0].values;
    const totalStudents = students.length;
    
    console.log(`\n   Total students: ${totalStudents}`);
    console.log('   Assigning sessions...\n');
    
    students.forEach((student) => {
      const id = student[0];
      const noPendaftaran = student[1];
      
      // Determine session based on FIXED registration number ranges
      let sesi = 1;
      if (noPendaftaran >= 72 && noPendaftaran <= 106) {
        sesi = 3;
      } else if (noPendaftaran >= 36 && noPendaftaran <= 71) {
        sesi = 2;
      } else if (noPendaftaran >= 1 && noPendaftaran <= 35) {
        sesi = 1;
      }
      
      db.run('UPDATE students SET sesi = ? WHERE id = ?', [sesi, id]);
      console.log(`   No. ${noPendaftaran} → Sesi ${sesi}`);
    });
    
    // Show summary
    const sesi1Count = db.exec('SELECT COUNT(*) FROM students WHERE sesi = 1')[0].values[0][0];
    const sesi2Count = db.exec('SELECT COUNT(*) FROM students WHERE sesi = 2')[0].values[0][0];
    const sesi3Count = db.exec('SELECT COUNT(*) FROM students WHERE sesi = 3')[0].values[0][0];
    
    console.log('\n📊 Summary:');
    console.log(`   Sesi 1: ${sesi1Count} siswa`);
    console.log(`   Sesi 2: ${sesi2Count} siswa`);
    console.log(`   Sesi 3: ${sesi3Count} siswa`);
  }

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  fs.writeFileSync(dbPath, newBuffer);

  console.log('\n✅ Database updated successfully');
  db.close();
}

addSesiColumn().catch(console.error);
