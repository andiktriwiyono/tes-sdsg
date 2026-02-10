const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Gunakan /tmp untuk writable storage di Netlify, atau data/ untuk local
const dbPath = fs.existsSync(path.join(__dirname, '../../data/antrian.db'))
  ? path.join(__dirname, '../../data/antrian.db')
  : path.join('/tmp', 'antrian.db');

let SQL = null;

// Initialize SQL.js
async function initSQL() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

// Initialize database
async function initDatabase() {
  const SQL = await initSQL();
  let db;
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Create table with all columns including FIFO timestamps and meja_asal
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      no_pendaftaran TEXT NOT NULL,
      nama_murid TEXT NOT NULL,
      jenis_kelamin TEXT DEFAULT '-',
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
      menunggu_dijemput INTEGER DEFAULT 0,
      target_meja TEXT DEFAULT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      meja_asal TEXT DEFAULT NULL
    )
  `);
  
  saveDatabase(db);
  return db;
}

function saveDatabase(db) {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const db = await initDatabase();
  
  try {
    if (event.httpMethod === 'GET') {
      const result = db.exec('SELECT * FROM students ORDER BY created_at DESC');
      const students = result.length > 0 ? result[0].values.map(row => ({
        id: row[0],
        no_pendaftaran: row[1],
        nama_murid: row[2],
        jenis_kelamin: row[3],
        nama_orang_tua: row[4],
        status: row[5],
        lokasi: row[6],
        lokasi_asal: row[7],
        sudah_test: row[8],
        test_start_time: row[9],
        test_end_time: row[10],
        pool_entry_time: row[11],
        tunggu1_entry_time: row[12],
        tunggu2_entry_time: row[13],
        created_at: row[14],
        updated_at: row[15],
        menunggu_dijemput: row[16],
        target_meja: row[17],
        meja_asal: row[18],
        sesi: row[19] || 1
      })) : [];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(students)
      };
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      db.run(`
        INSERT INTO students (no_pendaftaran, nama_murid, jenis_kelamin, nama_orang_tua, status, lokasi, lokasi_asal, sudah_test, test_start_time, test_end_time, pool_entry_time, tunggu1_entry_time, tunggu2_entry_time, menunggu_dijemput, target_meja, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.no_pendaftaran,
        data.nama_murid,
        data.jenis_kelamin || '-',
        data.nama_orang_tua || '-',
        data.status || 'active',
        data.lokasi || 'daftar',
        data.lokasi_asal || null,
        data.sudah_test || 0,
        data.test_start_time || null,
        data.test_end_time || null,
        data.pool_entry_time || null,
        data.tunggu1_entry_time || null,
        data.tunggu2_entry_time || null,
        data.menunggu_dijemput || 0,
        data.target_meja || null,
        data.created_at || new Date().toISOString()
      ]);

      saveDatabase(db);

      const result = db.exec('SELECT * FROM students ORDER BY id DESC LIMIT 1');
      const newStudent = result[0].values.map(row => ({
        id: row[0],
        no_pendaftaran: row[1],
        nama_murid: row[2],
        jenis_kelamin: row[3],
        nama_orang_tua: row[4],
        status: row[5],
        lokasi: row[6],
        lokasi_asal: row[7],
        sudah_test: row[8],
        test_start_time: row[9],
        test_end_time: row[10],
        pool_entry_time: row[11],
        tunggu1_entry_time: row[12],
        tunggu2_entry_time: row[13],
        created_at: row[14],
        updated_at: row[15],
        menunggu_dijemput: row[16],
        target_meja: row[17]
      }))[0];
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newStudent)
      };
    }

    if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body);
      
      // Build dynamic UPDATE query based on provided fields
      const updates = [];
      const values = [];
      
      if (data.lokasi !== undefined) {
        updates.push('lokasi = ?');
        values.push(data.lokasi);
        
        // Auto-set timestamps based on location
        if (data.lokasi === 'tunggu1') {
          updates.push('tunggu1_entry_time = ?');
          values.push(new Date().toISOString());
        } else if (data.lokasi === 'tunggu2') {
          updates.push('tunggu2_entry_time = ?');
          values.push(new Date().toISOString());
        } else if (data.lokasi === 'test') {
          updates.push('pool_entry_time = ?');
          values.push(new Date().toISOString());
        }
      }
      
      if (data.lokasi_asal !== undefined) {
        updates.push('lokasi_asal = ?');
        values.push(data.lokasi_asal);
      }
      
      if (data.sudah_test !== undefined) {
        updates.push('sudah_test = ?');
        values.push(data.sudah_test);
      }
      
      if (data.test_start_time !== undefined) {
        updates.push('test_start_time = ?');
        values.push(data.test_start_time);
      }
      
      if (data.test_end_time !== undefined) {
        updates.push('test_end_time = ?');
        values.push(data.test_end_time);
      }
      
      if (data.pool_entry_time !== undefined) {
        updates.push('pool_entry_time = ?');
        values.push(data.pool_entry_time);
      }
      
      if (data.tunggu1_entry_time !== undefined) {
        updates.push('tunggu1_entry_time = ?');
        values.push(data.tunggu1_entry_time);
      }
      
      if (data.tunggu2_entry_time !== undefined) {
        updates.push('tunggu2_entry_time = ?');
        values.push(data.tunggu2_entry_time);
      }
      
      if (data.menunggu_dijemput !== undefined) {
        updates.push('menunggu_dijemput = ?');
        values.push(data.menunggu_dijemput);
      }
      
      if (data.target_meja !== undefined) {
        updates.push('target_meja = ?');
        values.push(data.target_meja);
      }
      
      if (data.meja_asal !== undefined) {
        updates.push('meja_asal = ?');
        values.push(data.meja_asal);
      }
      
      updates.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(data.id);
      
      db.run(`
        UPDATE students 
        SET ${updates.join(', ')}
        WHERE id = ?
      `, values);
      
      saveDatabase(db);

      const result = db.exec('SELECT * FROM students WHERE id = ?', [data.id]);
      const updated = result[0].values.map(row => ({
        id: row[0],
        no_pendaftaran: row[1],
        nama_murid: row[2],
        jenis_kelamin: row[3],
        nama_orang_tua: row[4],
        status: row[5],
        lokasi: row[6],
        lokasi_asal: row[7],
        sudah_test: row[8],
        test_start_time: row[9],
        test_end_time: row[10],
        pool_entry_time: row[11],
        tunggu1_entry_time: row[12],
        tunggu2_entry_time: row[13],
        created_at: row[14],
        updated_at: row[15],
        menunggu_dijemput: row[16],
        target_meja: row[17]
      }))[0];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated)
      };
    }

    if (event.httpMethod === 'DELETE') {
      const data = JSON.parse(event.body);
      db.run('DELETE FROM students WHERE id = ?', [data.id]);
      saveDatabase(db);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    db.close();
  }
};
