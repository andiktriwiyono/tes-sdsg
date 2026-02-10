const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;

async function getDb() {
  if (db) return db;
  
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', '..', 'data', 'antrian.db');
  const buffer = fs.readFileSync(dbPath);
  db = new SQL.Database(buffer);
  return db;
}

function saveDb(database) {
  const dbPath = path.join(__dirname, '..', '..', 'data', 'antrian.db');
  const data = database.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const database = await getDb();

    // GET - Get all teachers
    if (event.httpMethod === 'GET') {
      const results = database.exec('SELECT * FROM teachers ORDER BY meja_number ASC, position ASC');
      
      if (results.length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify([])
        };
      }

      const teachers = results[0].values.map(row => ({
        id: row[0],
        meja_number: row[1],
        teacher_name: row[2],
        position: row[3],
        created_at: row[4],
        updated_at: row[5]
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(teachers)
      };
    }

    // PUT - Update teacher
    if (event.httpMethod === 'PUT') {
      const { id, teacher_name } = JSON.parse(event.body);
      const now = new Date().toISOString();

      database.run(
        'UPDATE teachers SET teacher_name = ?, updated_at = ? WHERE id = ?',
        [teacher_name, now, id]
      );
      saveDb(database);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Teacher updated successfully' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
