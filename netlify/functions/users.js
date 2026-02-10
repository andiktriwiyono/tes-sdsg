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

    // GET - Get all users
    if (event.httpMethod === 'GET') {
      const results = database.exec('SELECT * FROM users ORDER BY id ASC');
      
      if (results.length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify([])
        };
      }

      const users = results[0].values.map(row => ({
        id: row[0],
        username: row[1],
        password: row[2],
        name: row[3],
        role: row[4],
        created_at: row[5],
        updated_at: row[6]
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(users)
      };
    }

    // POST - Add new user
    if (event.httpMethod === 'POST') {
      const { username, password, name, role } = JSON.parse(event.body);
      const now = new Date().toISOString();

      try {
        database.run(
          'INSERT INTO users (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)',
          [username, password, name, role, now]
        );
        saveDb(database);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ message: 'User created successfully' })
        };
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Username already exists' })
          };
        }
        throw error;
      }
    }

    // PUT - Update user
    if (event.httpMethod === 'PUT') {
      const { id, username, password, name, role } = JSON.parse(event.body);
      const now = new Date().toISOString();

      database.run(
        'UPDATE users SET username = ?, password = ?, name = ?, role = ?, updated_at = ? WHERE id = ?',
        [username, password, name, role, now, id]
      );
      saveDb(database);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User updated successfully' })
      };
    }

    // DELETE - Delete user
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body);

      // Prevent deleting admin user
      const results = database.exec('SELECT username FROM users WHERE id = ?', [id]);
      if (results.length > 0 && results[0].values[0][0] === 'admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Cannot delete admin user' })
        };
      }

      database.run('DELETE FROM users WHERE id = ?', [id]);
      saveDb(database);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User deleted successfully' })
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
