const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

/**
 * Script perbaikan database lengkap
 * Memperbaiki struktur tabel students dan teachers
 * Menambahkan semua kolom yang diperlukan
 */

async function fixDatabase() {
  console.log('🔧 Memulai perbaikan database lengkap...\n');

  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  const dbDir = path.join(__dirname, '..', 'data');

  // Buat folder data jika belum ada
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Folder data dibuat\n');
  }

  let db;
  let isNewDatabase = false;

  // Cek apakah database sudah ada
  if (fs.existsSync(dbPath)) {
    console.log('📦 Database ditemukan, akan diperbaiki...\n');
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    console.log('📦 Membuat database baru...\n');
    db = new SQL.Database();
    isNewDatabase = true;
  }

  try {
    // ==========================================
    // 1. BACKUP DATA LAMA
    // ==========================================
    let oldStudents = [];
    let oldUsers = [];
    let oldTeachers = [];

    if (!isNewDatabase) {
      console.log('💾 Backup data lama...');
      
      try {
        const studentsResult = db.exec('SELECT * FROM students');
        if (studentsResult.length > 0) {
          oldStudents = studentsResult[0].values;
          console.log(`   ✅ Backup ${oldStudents.length} siswa`);
        }
      } catch (e) {
        console.log('   ⚠️  Tabel students tidak ada atau error');
      }

      try {
        const usersResult = db.exec('SELECT * FROM users');
        if (usersResult.length > 0) {
          oldUsers = usersResult[0].values;
          console.log(`   ✅ Backup ${oldUsers.length} users`);
        }
      } catch (e) {
        console.log('   ⚠️  Tabel users tidak ada atau error');
      }

      try {
        const teachersResult = db.exec('SELECT * FROM teachers');
        if (teachersResult.length > 0) {
          oldTeachers = teachersResult[0].values;
          console.log(`   ✅ Backup ${oldTeachers.length} teachers`);
        }
      } catch (e) {
        console.log('   ⚠️  Tabel teachers tidak ada atau error');
      }
      console.log('');
    }

    // ==========================================
    // 2. DROP TABEL LAMA
    // ==========================================
    console.log('🗑️  Menghapus tabel lama...');
    try {
      db.run('DROP TABLE IF EXISTS students');
      db.run('DROP TABLE IF EXISTS users');
      db.run('DROP TABLE IF EXISTS teachers');
      console.log('   ✅ Tabel lama dihapus\n');
    } catch (e) {
      console.log('   ⚠️  Error drop table:', e.message, '\n');
    }

    // ==========================================
    // 3. BUAT TABEL BARU DENGAN STRUKTUR LENGKAP
    // ==========================================
    
    // 3.1 Tabel Students
    console.log('1️⃣  Membuat tabel students dengan struktur lengkap...');
    db.run(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no_pendaftaran TEXT NOT NULL,
        nama_murid TEXT NOT NULL,
        jenis_kelamin TEXT DEFAULT NULL,
        nama_orang_tua TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        lokasi TEXT DEFAULT 'daftar',
        lokasi_asal TEXT DEFAULT NULL,
        sudah_test INTEGER DEFAULT 0,
        test_start_time TEXT DEFAULT NULL,
        test_end_time TEXT DEFAULT NULL,
        pool_entry_time TEXT DEFAULT NULL,
        tunggu1_entry_time TEXT DEFAULT NULL,
        tunggu2_entry_time TEXT DEFAULT NULL,
        menunggu_dijemput INTEGER DEFAULT 0,
        target_meja TEXT DEFAULT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT DEFAULT NULL,
        meja_asal TEXT DEFAULT NULL,
        sesi TEXT DEFAULT 'sesi1',
        escort_name TEXT DEFAULT NULL,
        escort_phone TEXT DEFAULT NULL
      )
    `);
    console.log('   ✅ Tabel students siap\n');

    // 3.2 Tabel Users
    console.log('2️⃣  Membuat tabel users...');
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT DEFAULT NULL
      )
    `);
    console.log('   ✅ Tabel users siap\n');

    // 3.3 Tabel Teachers
    console.log('3️⃣  Membuat tabel teachers...');
    db.run(`
      CREATE TABLE teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meja_number INTEGER NOT NULL,
        teacher_name TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT DEFAULT NULL
      )
    `);
    console.log('   ✅ Tabel teachers siap\n');

    // ==========================================
    // 4. RESTORE DATA LAMA (jika ada)
    // ==========================================
    if (oldStudents.length > 0) {
      console.log('📥 Restore data siswa lama...');
      let restoredCount = 0;
      for (const row of oldStudents) {
        try {
          db.run(`
            INSERT INTO students (
              id, no_pendaftaran, nama_murid, jenis_kelamin, nama_orang_tua,
              status, lokasi, lokasi_asal, sudah_test, test_start_time,
              test_end_time, pool_entry_time, tunggu1_entry_time, tunggu2_entry_time,
              menunggu_dijemput, target_meja, created_at, updated_at, meja_asal, sesi,
              escort_name, escort_phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            row[0], row[1], row[2], row[3] || null, row[4],
            row[5] || 'active', row[6] || 'daftar', row[7] || null, row[8] || 0, row[9] || null,
            row[10] || null, row[11] || null, row[12] || null, row[13] || null,
            row[14] || 0, row[15] || null, row[16] || new Date().toISOString(), row[17] || null,
            row[18] || null, row[19] || 'sesi1', row[20] || null, row[21] || null
          ]);
          restoredCount++;
        } catch (e) {
          console.log(`   ⚠️  Error restore siswa ID ${row[0]}:`, e.message);
        }
      }
      console.log(`   ✅ Restore ${restoredCount} siswa\n`);
    }

    if (oldUsers.length > 0) {
      console.log('📥 Restore data users lama...');
      let restoredCount = 0;
      for (const row of oldUsers) {
        try {
          db.run(`
            INSERT INTO users (id, username, password, name, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [row[0], row[1], row[2], row[3], row[4], row[5], row[6] || null]);
          restoredCount++;
        } catch (e) {
          console.log(`   ⚠️  Error restore user ${row[1]}:`, e.message);
        }
      }
      console.log(`   ✅ Restore ${restoredCount} users\n`);
    }

    if (oldTeachers.length > 0) {
      console.log('📥 Restore data teachers lama...');
      let restoredCount = 0;
      for (const row of oldTeachers) {
        try {
          db.run(`
            INSERT INTO teachers (id, meja_number, teacher_name, position, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [row[0], row[1], row[2], row[3], row[4], row[5] || null]);
          restoredCount++;
        } catch (e) {
          console.log(`   ⚠️  Error restore teacher ${row[2]}:`, e.message);
        }
      }
      console.log(`   ✅ Restore ${restoredCount} teachers\n`);
    }

    // ==========================================
    // 5. INSERT DEFAULT DATA (jika belum ada)
    // ==========================================
    const now = new Date().toISOString();

    // 5.1 Default Users
    if (oldUsers.length === 0) {
      console.log('👥 Menambahkan default users...');
      const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'ADMIN', name: 'Administrator' },
        { username: 'posruang', password: 'posruang123', role: 'POS_RUANG', name: 'Pos Ruang' },
        { username: 'koordinator', password: 'koordinator123', role: 'KOORDINATOR_RUANG_TEST', name: 'Koordinator Ruang Test' },
        { username: 'petugasantar', password: 'petugasantar123', role: 'PETUGAS_ANTAR', name: 'Petugas Antar-Jemput' },
        { username: 'penguji1', password: 'penguji123', role: 'PENGUJI_MEJA_1', name: 'Penguji Meja 1' },
        { username: 'penguji2', password: 'penguji123', role: 'PENGUJI_MEJA_2', name: 'Penguji Meja 2' },
        { username: 'penguji3', password: 'penguji123', role: 'PENGUJI_MEJA_3', name: 'Penguji Meja 3' },
        { username: 'penguji4', password: 'penguji123', role: 'PENGUJI_MEJA_4', name: 'Penguji Meja 4' },
        { username: 'penguji5', password: 'penguji123', role: 'PENGUJI_MEJA_5', name: 'Penguji Meja 5' }
      ];

      for (const user of defaultUsers) {
        db.run(
          'INSERT INTO users (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)',
          [user.username, user.password, user.name, user.role, now]
        );
        console.log(`   ✅ User ditambahkan: ${user.username}`);
      }
      console.log('');
    }

    // 5.2 Default Teachers
    if (oldTeachers.length === 0) {
      console.log('👨‍🏫 Menambahkan default teachers...');
      const defaultTeachers = [
        { meja_number: 1, teacher_name: 'Guru 1A', position: 1 },
        { meja_number: 1, teacher_name: 'Guru 1B', position: 2 },
        { meja_number: 2, teacher_name: 'Guru 2A', position: 1 },
        { meja_number: 2, teacher_name: 'Guru 2B', position: 2 },
        { meja_number: 3, teacher_name: 'Guru 3A', position: 1 },
        { meja_number: 3, teacher_name: 'Guru 3B', position: 2 },
        { meja_number: 4, teacher_name: 'Guru 4A', position: 1 },
        { meja_number: 4, teacher_name: 'Guru 4B', position: 2 },
        { meja_number: 5, teacher_name: 'Guru 5A', position: 1 },
        { meja_number: 5, teacher_name: 'Guru 5B', position: 2 }
      ];

      for (const teacher of defaultTeachers) {
        db.run(
          'INSERT INTO teachers (meja_number, teacher_name, position, created_at) VALUES (?, ?, ?, ?)',
          [teacher.meja_number, teacher.teacher_name, teacher.position, now]
        );
        console.log(`   ✅ Teacher ditambahkan: ${teacher.teacher_name} (Meja ${teacher.meja_number})`);
      }
      console.log('');
    }

    // ==========================================
    // 6. SAVE DATABASE
    // ==========================================
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);

    console.log('✅ DATABASE BERHASIL DIPERBAIKI!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RINGKASAN:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Count data
    const studentsCount = db.exec('SELECT COUNT(*) FROM students')[0].values[0][0];
    const usersCount = db.exec('SELECT COUNT(*) FROM users')[0].values[0][0];
    const teachersCount = db.exec('SELECT COUNT(*) FROM teachers')[0].values[0][0];

    console.log(`   📊 Total Siswa: ${studentsCount}`);
    console.log(`   👥 Total Users: ${usersCount}`);
    console.log(`   👨‍🏫 Total Teachers: ${teachersCount}`);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  PENTING:');
    console.log('   1. Restart PM2: pm2 restart antrian-test');
    console.log('   2. Test login di browser');
    console.log('   3. Test import data siswa');
    console.log('   4. Cek data guru di meja penguji');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error saat perbaikan database:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Jalankan perbaikan
fixDatabase().catch(error => {
  console.error('❌ Perbaikan database gagal:', error);
  process.exit(1);
});
