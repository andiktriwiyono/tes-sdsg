const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

/**
 * Script migrasi database lengkap untuk VPS
 * Jalankan script ini setelah deploy ke VPS untuk setup database
 */

async function migrateDatabase() {
  console.log('🚀 Memulai migrasi database...\n');

  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
  const dbDir = path.join(__dirname, '..', 'data');

  // Buat folder data jika belum ada
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Folder data dibuat');
  }

  let db;
  
  // Cek apakah database sudah ada
  if (fs.existsSync(dbPath)) {
    console.log('⚠️  Database sudah ada, akan diupdate...\n');
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    console.log('📦 Membuat database baru...\n');
    db = new SQL.Database();
  }

  try {
    // 1. Tabel students
    console.log('1️⃣  Membuat tabel students...');
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        no_pendaftaran TEXT NOT NULL,
        nama_murid TEXT NOT NULL,
        nama_orang_tua TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        lokasi TEXT DEFAULT 'daftar',
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    `);
    console.log('   ✅ Tabel students siap\n');

    // 2. Tabel users
    console.log('2️⃣  Membuat tabel users...');
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    `);
    console.log('   ✅ Tabel users siap\n');

    // 3. Tabel teachers
    console.log('3️⃣  Membuat tabel teachers...');
    db.run(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meja_number INTEGER NOT NULL,
        teacher_name TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    `);
    console.log('   ✅ Tabel teachers siap\n');

    // 4. Tambah kolom escort (jika belum ada)
    console.log('4️⃣  Menambahkan kolom escort...');
    try {
      db.run('ALTER TABLE students ADD COLUMN escort_name TEXT');
      db.run('ALTER TABLE students ADD COLUMN escort_phone TEXT');
      console.log('   ✅ Kolom escort ditambahkan\n');
    } catch (error) {
      console.log('   ⚠️  Kolom escort sudah ada\n');
    }

    // 5. Tambah kolom meja_asal (jika belum ada)
    console.log('5️⃣  Menambahkan kolom meja_asal...');
    try {
      db.run('ALTER TABLE students ADD COLUMN meja_asal INTEGER');
      console.log('   ✅ Kolom meja_asal ditambahkan\n');
    } catch (error) {
      console.log('   ⚠️  Kolom meja_asal sudah ada\n');
    }

    // 6. Tambah kolom sesi (jika belum ada)
    console.log('6️⃣  Menambahkan kolom sesi...');
    try {
      db.run('ALTER TABLE students ADD COLUMN sesi TEXT DEFAULT \'sesi1\'');
      console.log('   ✅ Kolom sesi ditambahkan\n');
    } catch (error) {
      console.log('   ⚠️  Kolom sesi sudah ada\n');
    }

    // 7. Tambah kolom jenis_kelamin (jika belum ada)
    console.log('7️⃣  Menambahkan kolom jenis_kelamin...');
    try {
      db.run('ALTER TABLE students ADD COLUMN jenis_kelamin TEXT');
      console.log('   ✅ Kolom jenis_kelamin ditambahkan\n');
    } catch (error) {
      console.log('   ⚠️  Kolom jenis_kelamin sudah ada\n');
    }

    // 8. Insert default users
    console.log('8️⃣  Menambahkan default users...');
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

    const now = new Date().toISOString();
    let usersAdded = 0;
    
    for (const user of defaultUsers) {
      try {
        db.run(
          'INSERT INTO users (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)',
          [user.username, user.password, user.name, user.role, now]
        );
        console.log(`   ✅ User ditambahkan: ${user.username}`);
        usersAdded++;
      } catch (error) {
        console.log(`   ⚠️  User ${user.username} sudah ada`);
      }
    }
    console.log(`   📊 Total ${usersAdded} user baru ditambahkan\n`);

    // 9. Insert default teachers
    console.log('9️⃣  Menambahkan default teachers...');
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

    let teachersAdded = 0;
    
    for (const teacher of defaultTeachers) {
      try {
        db.run(
          'INSERT INTO teachers (meja_number, teacher_name, position, created_at) VALUES (?, ?, ?, ?)',
          [teacher.meja_number, teacher.teacher_name, teacher.position, now]
        );
        console.log(`   ✅ Teacher ditambahkan: ${teacher.teacher_name} (Meja ${teacher.meja_number})`);
        teachersAdded++;
      } catch (error) {
        console.log(`   ⚠️  Teacher ${teacher.teacher_name} sudah ada`);
      }
    }
    console.log(`   📊 Total ${teachersAdded} teacher baru ditambahkan\n`);

    // Save database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);

    console.log('✅ MIGRASI DATABASE SELESAI!\n');
    console.log('📋 Ringkasan:');
    console.log(`   - Database: ${dbPath}`);
    console.log(`   - Users: ${usersAdded} baru ditambahkan`);
    console.log(`   - Teachers: ${teachersAdded} baru ditambahkan`);
    console.log('\n🔐 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  PENTING: Ganti password admin setelah login pertama kali!\n');

  } catch (error) {
    console.error('❌ Error saat migrasi:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Jalankan migrasi
migrateDatabase().catch(error => {
  console.error('❌ Migrasi gagal:', error);
  process.exit(1);
});
