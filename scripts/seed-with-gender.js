const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const students = [
  { no: "1", nama: "Afrah Shahia Adreena Leilani", jk: "Perempuan" },
  { no: "2", nama: "Ghaida Ibrahim Brilian Friwahyudi", jk: "Laki-laki" },
  { no: "3", nama: "Clarisa Zea Azahra", jk: "Perempuan" },
  { no: "4", nama: "Vasel Al-Rizky", jk: "Laki-laki" },
  { no: "5", nama: "Nafisa Mikayla Azzahra", jk: "Perempuan" },
  { no: "6", nama: "Arraffasya Ravazel Anwar", jk: "Laki-laki" },
  { no: "7", nama: "Azkara Jagat Sagara", jk: "Laki-laki" },
  { no: "8", nama: "Gheishal Shaqueela Aara Erista", jk: "Perempuan" },
  { no: "9", nama: "Muhammad Rafandra Brawijaya", jk: "Laki-laki" },
  { no: "10", nama: "Dirandra Mada Nararya", jk: "Laki-laki" },
  { no: "11", nama: "Jerry Al Ayubi", jk: "Laki-laki" },
  { no: "12", nama: "Muhammad Alfarezel Zeeshan Widodo", jk: "Laki-laki" },
  { no: "13", nama: "Muhammad Azzam Irsyam Efendy", jk: "Laki-laki" },
  { no: "14", nama: "Alnaira Azahra", jk: "Perempuan" },
  { no: "15", nama: "Zaifa Alnaira Hafshah", jk: "Perempuan" },
  { no: "16", nama: "Muhammad Rafardhan Zavier Farhana", jk: "Laki-laki" },
  { no: "17", nama: "Muhammad Razka Alsyazani", jk: "Laki-laki" },
  { no: "18", nama: "Dewi Nur Cahyani", jk: "Perempuan" },
  { no: "19", nama: "Elvino Fafian Alrosas", jk: "Laki-laki" },
  { no: "20", nama: "Ghaitsa Eshal Parveen Dinata", jk: "Perempuan" },
  { no: "21", nama: "Hafizh Arka", jk: "Laki-laki" },
  { no: "22", nama: "Muchammad Nur Syahid", jk: "Laki-laki" },
  { no: "23", nama: "Muhammad Irsyad Al Ghifari", jk: "Laki-laki" },
  { no: "24", nama: "Muhammad Umar Al Faruq", jk: "Laki-laki" },
  { no: "25", nama: "Jatmiko Bahari Jana", jk: "Laki-laki" },
  { no: "26", nama: "Muchammad Reyhan Arghani Mustagbal", jk: "Laki-laki" },
  { no: "27", nama: "Ardyasyah Rafif Raditya", jk: "Laki-laki" },
  { no: "28", nama: "Balqis Afsin Salsabila", jk: "Perempuan" },
  { no: "29", nama: "Nova Putri Almahyra", jk: "Perempuan" },
  { no: "30", nama: "Adara Nabila Khalisa", jk: "Perempuan" },
  { no: "31", nama: "Sabrina Allysa", jk: "Perempuan" },
  { no: "32", nama: "Muhamad Fathian Alfarizi", jk: "Laki-laki" },
  { no: "33", nama: "Defano Ezian Melfiano", jk: "Laki-laki" },
  { no: "34", nama: "Abizar Akbar Maulana", jk: "Laki-laki" },
  { no: "35", nama: "Zamorano Khalid Al Ayyubi", jk: "Laki-laki" },
  { no: "36", nama: "Nadine Aqilla Putri Dewangga", jk: "Perempuan" },
  { no: "37", nama: "Ishaq Yafiq Efendi", jk: "Laki-laki" },
  { no: "38", nama: "Azfar Zill Arsyad", jk: "Laki-laki" },
  { no: "39", nama: "Arsya Nizam Al Nahyan", jk: "Laki-laki" },
  { no: "40", nama: "Elleora Medina Setyanto", jk: "Perempuan" },
  { no: "41", nama: "Ayyumi Lintang Arundaya Damara", jk: "Perempuan" },
  { no: "42", nama: "Janaka Al Hanan Xavier Alamsyah", jk: "Laki-laki" },
  { no: "43", nama: "Afif Rasyid Mubarak", jk: "Laki-laki" },
  { no: "44", nama: "Alya Putri Wibowo", jk: "Perempuan" },
  { no: "45", nama: "Adzkia Rumaysaa Ghassani", jk: "Perempuan" },
  { no: "46", nama: "Khayra Sisqia Arvindra", jk: "Perempuan" },
  { no: "47", nama: "Aryasatya Zayan Ahmad", jk: "Laki-laki" },
  { no: "48", nama: "Muhammad Zaidan", jk: "Laki-laki" },
  { no: "49", nama: "Azea Yasna Umaiza", jk: "Perempuan" },
  { no: "50", nama: "Althafarizqy Fathan Abdillah", jk: "Laki-laki" },
  { no: "51", nama: "Muejaza Winar Cahyono", jk: "Laki-laki" },
  { no: "52", nama: "Alya Khoirunnisa", jk: "Perempuan" },
  { no: "54", nama: "Syabil Endaru Rafeyfa Setiawan", jk: "Laki-laki" },
  { no: "55", nama: "Rysatya Atharrazka Arkana", jk: "Laki-laki" },
  { no: "56", nama: "Ahmad Danish Athallah", jk: "Laki-laki" },
  { no: "57", nama: "Sancaka", jk: "Laki-laki" },
  { no: "58", nama: "Rafka Pradipta Al Farizqy", jk: "Laki-laki" },
  { no: "59", nama: "Kayla Aishwa Nahla", jk: "Perempuan" },
  { no: "60", nama: "Arsenio Keenan Arasya", jk: "Laki-laki" },
  { no: "61", nama: "Ghayda Zea Mafaza", jk: "Perempuan" },
  { no: "62", nama: "Muhamad Ilyas Khairanhanan", jk: "Laki-laki" },
  { no: "63", nama: "Nizam Satya Nalendra", jk: "Laki-laki" },
  { no: "64", nama: "Enzio Arkana Junaedi", jk: "Laki-laki" },
  { no: "65", nama: "Viona Jasmine Al-Zaina", jk: "Perempuan" },
  { no: "66", nama: "Alzaidan Haidar Khairi", jk: "Laki-laki" },
  { no: "67", nama: "Khaliza Chayra Khanza", jk: "Perempuan" },
  { no: "68", nama: "Alnaira Aruna Naladhipa", jk: "Perempuan" },
  { no: "69", nama: "Arzanka Gibran Al-Fatih", jk: "Laki-laki" },
  { no: "70", nama: "Arshaka Gibran Al-Fatih", jk: "Laki-laki" },
  { no: "71", nama: "Muhammad Gibran Al Ghifari", jk: "Laki-laki" },
  { no: "72", nama: "Muhammad Athafariz Faezya", jk: "Laki-laki" },
  { no: "73", nama: "Salma Kamilatus Zakia", jk: "Perempuan" },
  { no: "74", nama: "Narendra Alfarezel Tsani", jk: "Laki-laki" },
  { no: "75", nama: "Aqira Jihan Alishba", jk: "Perempuan" },
  { no: "76", nama: "Jaladra Andaru", jk: "Laki-laki" },
  { no: "77", nama: "Mayrani Zhafira Ajeng", jk: "Perempuan" },
  { no: "78", nama: "Ahmad Baharudin Kamil", jk: "Laki-laki" },
  { no: "79", nama: "Arrayyan Abrizam Hasan", jk: "Laki-laki" },
  { no: "80", nama: "Fabio", jk: "Laki-laki" },
  { no: "81", nama: "Amtaza Syahla Al Asror", jk: "Perempuan" },
  { no: "82", nama: "Fantiya Hanin Almahyra", jk: "Perempuan" },
  { no: "83", nama: "Muhammad Zafran Aditya", jk: "Laki-laki" },
  { no: "84", nama: "Khansania Mutiara Kinanti", jk: "Perempuan" },
  { no: "85", nama: "Galang Rafif Khairurrafiqi", jk: "Laki-laki" },
  { no: "86", nama: "Dzakira Ailani Ranvi", jk: "Perempuan" },
  { no: "87", nama: "Faqih Nanda Mubaroq", jk: "Laki-laki" },
  { no: "88", nama: "Muhammad Zhafran Uzayr Aulian", jk: "Laki-laki" },
  { no: "89", nama: "Alesha Silmia El Arifin", jk: "Perempuan" },
  { no: "90", nama: "Roberto Aksa Mara", jk: "Laki-laki" },
  { no: "91", nama: "Kenesya Ayuni Candrawati", jk: "Perempuan" },
  { no: "92", nama: "Sakha Madya Batara", jk: "Laki-laki" },
  { no: "93", nama: "Afsheen Zalesya Al Mahzub", jk: "Perempuan" },
  { no: "94", nama: "Zannuba Ariffah Chafsoh", jk: "Perempuan" },
  { no: "95", nama: "Asadullah Uways Al Musthofa", jk: "Laki-laki" },
  { no: "96", nama: "Arshavin Wiska Madriddista", jk: "Laki-laki" },
  { no: "97", nama: "Rashdan Arjuna Al Wavi Husein", jk: "Laki-laki" },
  { no: "98", nama: "Rafassya Ataya Aunullah", jk: "Laki-laki" },
  { no: "99", nama: "Aqio Faiq Arkana Zain", jk: "Laki-laki" },
  { no: "100", nama: "Keyanna Wita Gayatri", jk: "Perempuan" },
  { no: "101", nama: "Azalea Syachira Fladela", jk: "Perempuan" },
  { no: "102", nama: "Alvino Nazril Rashaad", jk: "Laki-laki" },
  { no: "103", nama: "Gamila Yanava Dhatu", jk: "Perempuan" },
  { no: "104", nama: "Ryuichie Kairo Syahreza Nugroho", jk: "Laki-laki" },
  { no: "105", nama: "Tiara Sifa Bella Fiqtawara", jk: "Perempuan" },
  { no: "106", nama: "Ammar Nadhif Ramdan Wijaya", jk: "Laki-laki" }
];

async function seedDatabase() {
  console.log('🌱 Memulai seeding database dengan data baru...\n');
  
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create table with all columns including FIFO timestamps
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      no_pendaftaran TEXT NOT NULL,
      nama_murid TEXT NOT NULL,
      jenis_kelamin TEXT NOT NULL,
      nama_orang_tua TEXT DEFAULT '-',
      status TEXT DEFAULT 'active',
      lokasi TEXT DEFAULT 'daftar',
      lokasi_asal TEXT DEFAULT NULL,
      sudah_test INTEGER DEFAULT 0,
      test_start_time TEXT DEFAULT NULL,
      test_end_time TEXT DEFAULT NULL,
      pool_entry_time TEXT DEFAULT NULL,
      tunggu1_entry_time TEXT DEFAULT NULL,
      tunggu2_entry_time TEXT DEFAULT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    )
  `);

  console.log('✅ Tabel berhasil dibuat dengan kolom lengkap (FIFO timestamps untuk Tunggu 1, Tunggu 2, dan Pool Test)');
  console.log(`📝 Memasukkan ${students.length} data siswa...\n`);

  // Insert all students
  const stmt = db.prepare(`
    INSERT INTO students (no_pendaftaran, nama_murid, jenis_kelamin, nama_orang_tua, status, lokasi, lokasi_asal, sudah_test, test_start_time, test_end_time, pool_entry_time, tunggu1_entry_time, tunggu2_entry_time, created_at)
    VALUES (?, ?, ?, '-', 'active', 'daftar', NULL, 0, NULL, NULL, NULL, NULL, NULL, ?)
  `);

  students.forEach((student, index) => {
    stmt.run([
      student.no,
      student.nama,
      student.jk,
      new Date().toISOString()
    ]);
    
    if ((index + 1) % 10 === 0) {
      console.log(`   ✓ ${index + 1} siswa telah dimasukkan...`);
    }
  });

  stmt.free();

  // Verify data
  const result = db.exec('SELECT COUNT(*) as total FROM students');
  const total = result[0].values[0][0];
  
  // Count by gender
  const genderResult = db.exec(`
    SELECT jenis_kelamin, COUNT(*) as count 
    FROM students 
    GROUP BY jenis_kelamin
  `);
  
  console.log(`\n✅ Seeding selesai!`);
  console.log(`📊 Total siswa di database: ${total}`);
  
  if (genderResult.length > 0) {
    console.log(`\n👥 Statistik Jenis Kelamin:`);
    genderResult[0].values.forEach(row => {
      console.log(`   ${row[0]}: ${row[1]} siswa`);
    });
  }

  // Save to file
  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = path.join(dbDir, 'antrian.db');
  fs.writeFileSync(dbPath, buffer);
  
  console.log(`\n💾 Database disimpan di: ${dbPath}`);

  // Also save to /tmp for local server
  const tmpPath = path.join('/tmp', 'antrian.db');
  try {
    fs.writeFileSync(tmpPath, buffer);
    console.log(`💾 Database juga disimpan di: ${tmpPath}`);
  } catch (err) {
    console.log(`⚠️  Tidak bisa menyimpan ke /tmp (normal di Windows)`);
  }

  db.close();
  console.log('\n🎉 Proses seeding berhasil!');
  console.log('⚠️  PENTING: Restart server untuk menggunakan database baru!');
}

seedDatabase().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
