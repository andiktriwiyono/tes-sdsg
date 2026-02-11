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
        updated_at: row[5],
        is_break: row[6] || 0
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(teachers)
      };
    }

    // PUT - Update teacher or toggle break
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body);
      const now = new Date().toISOString();

      // Toggle break status for a meja
      if (body.action === 'toggle_break' && body.meja_number) {
        const { meja_number, is_break } = body;
        
        // Update all teachers at this meja
        database.run(
          'UPDATE teachers SET is_break = ?, updated_at = ? WHERE meja_number = ?',
          [is_break ? 1 : 0, now, meja_number]
        );
        saveDb(database);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Break status updated successfully',
            meja_number,
            is_break: is_break ? 1 : 0
          })
        };
      }

      // Update teacher name
      if (body.id && body.teacher_name) {
        const { id, teacher_name } = body;
        
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
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' })
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
