const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;

// Import the Netlify functions
const studentsHandler = require('./netlify/functions/students').handler;
const usersHandler = require('./netlify/functions/users').handler;
const teachersHandler = require('./netlify/functions/teachers').handler;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle API requests for students
  if (req.url.startsWith('/.netlify/functions/students') || req.url.startsWith('/api/students')) {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const event = {
          httpMethod: req.method,
          headers: req.headers,
          body: body || null,
          path: req.url,
          queryStringParameters: {}
        };

        const response = await studentsHandler(event);
        
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Handle API requests for users
  if (req.url.startsWith('/.netlify/functions/users') || req.url.startsWith('/api/users')) {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const event = {
          httpMethod: req.method,
          headers: req.headers,
          body: body || null,
          path: req.url,
          queryStringParameters: {}
        };

        const response = await usersHandler(event);
        
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Handle API requests for teachers
  if (req.url.startsWith('/.netlify/functions/teachers') || req.url.startsWith('/api/teachers')) {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const event = {
          httpMethod: req.method,
          headers: req.headers,
          body: body || null,
          path: req.url,
          queryStringParameters: {}
        };

        const response = await teachersHandler(event);
        
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
  
  // Handle admin routes
  if (req.url === '/admin' || req.url === '/admin/') {
    filePath = './public/admin.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}/`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/students`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`👨‍🏫 Teachers API: http://localhost:${PORT}/api/teachers\n`);
});
