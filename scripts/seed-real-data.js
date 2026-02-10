const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const students = [
  { no: "1", nama: "Afrah Shahia Adreena Leilani", ortu: "-" },
  { no: "2", nama: "Ghaida Ibrahim Brilian Friwahyudi", ortu: "-" },
  { no: "3", nama: "Clarisa Zea Azahra", ortu: "-" },
  { no: "4", nama: "Vasel Al-Rizky", ortu: "-" },
  { no: "5", nama: "Nafisa Mikayla Azzahra", ortu: "-" },
  { no: "6", nama: "Arraffasya Ravazel Anwar", ortu: "-" },
  { no: "7", nama: "Azkara Jagat Sagara", ortu: "-" },
  { no: "8", nama: "Gheishal Shaqueela Aara Erista", ortu: "-" },
  { no: "9", nama: "Muhammad Rafandra Brawijaya", ortu: "-" },
  { no: "10", nama: "Dirandra Mada Nararya", ortu: "-" },
  { no: "11", nama: "Jerry Al Ayubi", ortu: "-" },
  { no: "12", nama: "Muhammad Alfarezel Zeeshan Widodo", ortu: "-" },
  { no: "13", nama: "Muhammad Azzam Irsyam Efendy", ortu: "-" },
  { no: "14", nama: "Alnaira Azahra", ortu: "-" },
  { no: "15", nama: "Zaifa Alnaira Hafshah", ortu: "-" },
  { no: "16", nama: "Muhammad Rafardhan Zavier Farhana", ortu: "-" },
  { no: "17", nama: "Muhammad Razka Alsyazani", ortu: "-" },
  { no: "18", nama: "Dewi Nur Cahyani", ortu: "-" },
  { no: "19", nama: "Elvino Fafian Alrosas", ortu: "-" },
  { no: "20", nama: "Ghaitsa Eshal Parveen Dinata", ortu: "-" },
  { no: "21", nama: "Hafizh Arka", ortu: "-" },
  { no: "22", nama: "Muchammad Nur Syahid", ortu: "-" },
  { no: "23", nama: "Muhammad Irsyad Al Ghifari", ortu: "-" },
  { no: "24", nama: "Muhammad Umar Al Faruq", ortu: "-" },
  { no: "25", nama: "Jatmiko Bahari Jana", ortu: "-" },
  { no: "26", nama: "Muchammad Reyhan Arghani Mustagbal", ortu: "-" },
  { no: "27", nama: "Ardyasyah Rafif Raditya", ortu: "-" },
  { no: "28", nama: "Balqis Afsin Salsabila", ortu: "-" },
  { no: "29", nama: "Nova Putri Almahyra", ortu: "-" },
  { no: "30", nama: "Adara Nabila Khalisa", ortu: "-" },
  { no: "31", nama: "Sabrina Allysa", ortu: "-" },
  { no: "32", nama: "Muhamad Fathian Alfarizi", ortu: "-" },
  { no: "33", nama: "Defano Ezian Melfiano", ortu: "-" },
  { no: "34", nama: "Abizar Akbar Maulana", ortu: "-" },
  { no: "35", nama: "Zamorano Khalid Al Ayyubi", ortu: "-" },
  { no: "36", nama: "Nadine Aqilla Putri Dewangga", ortu: "-" },
  { no: "37", nama: "Ishaq Yafiq Efendi", ortu: "-" },
  { no: "38", nama: "Azfar Zill Arsyad", ortu: "-" },
  { no: "39", nama: "Arsya Nizam Al Nahyan", ortu: "-" },
  { no: "40", nama: "Elleora Medina Setyanto", ortu: "-" },
  { no: "41", nama: "Ayyumi Lintang Arundaya Damara", ortu: "-" },
  { no: "42", nama: "Janaka Al Hanan Xavier Alamsyah", ortu: "-" },
  { no: "43", nama: "Afif Rasyid Mubarak", ortu: "-" },
  { no: "44", nama: "Alya Putri Wibowo", ortu: "-" },
  { no: "45", nama: "Adzkia Rumaysaa Ghassani", ortu: "-" },
  { no: "46", nama: "Khayra Sisqia Arvindra", ortu: "-" },
  { no: "47", nama: "Aryasatya Zayan Ahmad", ortu: "-" },
  { no: "48", nama: "Muhammad Zaidan", ortu: "-" },
  { no: "49", nama: "Azea Yasna Umaiza", ortu: "-" },
  { no: "50", nama: "Althafarizqy Fathan Abdillah", ortu: "-" },
  { no: "51", nama: "Muejaza Winar Cahyono", ortu: "-" },
  { no: "52", nama: "Alya Khoirunnisa", ortu: "-" },
  { no: "54", nama: "Syabil Endaru Rafeyfa Setiawan", ortu: "-" },
  { no: "55", nama: "Rysatya Atharrazka Arkana", ortu: "-" },
  { no: "56", nama: "Ahmad Danish Athallah", ortu: "-" },
  { no: "57", nama: "Sancaka", ortu: "-" },
  { no: "58", nama: "Rafka Pradipta Al Farizqy", ortu: "-" },
  { no: "59", nama: "Kayla Aishwa Nahla", ortu: "-" },
  { no: "60", nama: "Arsenio Keenan Arasya", ortu: "-" },
  { no: "61", nama: "Ghayda Zea Mafaza", ortu: "-" },
  { no: "62", nama: "Muhamad Ilyas Khairanhanan", ortu: "-" },
  { no: "63", nama: "Nizam Satya Nalendra", ortu: "-" },
  { no: "64", nama: "Enzio Arkana Junaedi", ortu: "-" },
  { no: "65", nama: "Viona Jasmine Al-Zaina", ortu: "-" },
  { no: "66", nama: "Alzaidan Haidar Khairi", ortu: "-" },
  { no: "67", nama: "Khaliza Chayra Khanza", ortu: "-" },
  { no: "68", nama: "Alnaira Aruna Naladhipa", ortu: "-" },
  { no: "69", nama: "Arzanka Gibran Al-Fatih", ortu: "-" },
  { no: "70", nama: "Arshaka Gibran Al-Fatih", ortu: "-" },
  { no: "71", nama: "Muhammad Gibran Al Ghifari", ortu: "-" },
  { no: "72", nama: "Muhammad Athafariz Faezya", ortu: "-" },
  { no: "73", nama: "Salma Kamilatus Zakia", ortu: "-" },
  { no: "74", nama: "Narendra Alfarezel Tsani", ortu: "-" },
  { no: "75", nama: "Aqira Jihan Alishba", ortu: "-" },
  { no: "76", nama: "Jaladra Andaru", ortu: "-" },
  { no: "77", nama: "Mayrani Zhafira Ajeng", ortu: "-" },
  { no: "78", nama: "Ahmad Baharudin Kamil", ortu: "-" },
  { no: "79", nama: "Arrayyan Abrizam Hasan", ortu: "-" },
  { no: "80", nama: "Fabio", ortu: "-" },
  { no: "81", nama: "Amtaza Syahla Al Asror", ortu: "-" },
  { no: "82", nama: "Fantiya Hanin Almahyra", ortu: "-" },
  { no: "83", nama: "Muhammad Zafran Aditya", ortu: "-" },
  { no: "84", nama: "Khansania Mutiara Kinanti", ortu: "-" },
  { no: "85", nama: "Galang Rafif Khairurrafiqi", ortu: "-" },
  { no: "86", nama: "Dzakira Ailani Ranvi", ortu: "-" },
  { no: "87", nama: "Faqih Nanda Mubaroq", ortu: "-" },
  { no: "88", nama: "Muhammad Zhafran Uzayr Aulian", ortu: "-" },
  { no: "89", nama: "Alesha Silmia El Arifin", ortu: "-" },
  { no: "90", nama: "Roberto Aksa Mara", ortu: "-" },
  { no: "91", nama: "Kenesya Ayuni Candrawati", ortu: "-" },
  { no: "92", nama: "Sakha Madya Batara", ortu: "-" },
  { no: "93", nama: "Afsheen Zalesya Al Mahzub", ortu: "-" },
  { no: "94", nama: "Zannuba Ariffah Chafsoh", ortu: "-" },
  { no: "95", nama: "Asadullah Uways Al Musthofa", ortu: "-" },
  { no: "96", nama: "Arshavin Wiska Madriddista", ortu: "-" },
  { no: "97", nama: "Rashdan Arjuna Al Wavi Husein", ortu: "-" },
  { no: "98", nama: "Rafassya Ataya Aunullah", ortu: "-" },
  { no: "99", nama: "Aqio Faiq Arkana Zain", ortu: "-" },
  { no: "100", nama: "Keyanna Wita Gayatri", ortu: "-" },
  { no: "101", nama: "Azalea Syachira Fladela", ortu: "-" },
  { no: "102", nama: "Alvino Nazril Rashaad", ortu: "-" },
  { no: "103", nama: "Gamila Yanava Dhatu", ortu: "-" },
  { no: "104", nama: "Ryuichie Kairo Syahreza Nugroho", ortu: "-" },
  { no: "105", nama: "Tiara Sifa Bella Fiqtawara", ortu: "-" },
  { no: "106", nama: "Ammar Nadhif Ramdan Wijaya", ortu: "-" }
];

async function seedDatabase() {
  console.log('🌱 Memulai seeding database...\n');
  
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create table
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

  console.log('✅ Tabel berhasil dibuat');
  console.log(`📝 Memasukkan ${students.length} data siswa...\n`);

  // Insert all students
  const stmt = db.prepare(`
    INSERT INTO students (no_pendaftaran, nama_murid, nama_orang_tua, status, lokasi, created_at)
    VALUES (?, ?, ?, 'active', 'daftar', ?)
  `);

  students.forEach((student, index) => {
    stmt.run([
      student.no,
      student.nama,
      student.ortu,
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
  
  console.log(`\n✅ Seeding selesai!`);
  console.log(`📊 Total siswa di database: ${total}`);

  // Save to file for Netlify Functions
  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = path.join(dbDir, 'antrian.db');
  fs.writeFileSync(dbPath, buffer);
  
  console.log(`💾 Database disimpan di: ${dbPath}`);

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
}

seedDatabase().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
