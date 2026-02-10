# ⚡ Quick Improvements - Implementation Guide

Panduan cepat untuk implementasi improvement yang paling critical.

---

## 🎯 Priority 1: Security (CRITICAL - 2 Days)

### Step 1: Password Hashing (2 hours)

```bash
npm install bcryptjs
```

**Update `netlify/functions/users.js`:**

```javascript
const bcrypt = require('bcryptjs');

// POST - Create user (line ~50)
const hashedPassword = await bcrypt.hash(password, 10);
db.run(`INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)`,
  [username, name, hashedPassword, role]);

// Login validation (add new function)
async function validateLogin(username, password) {
  const users = db.exec('SELECT * FROM users WHERE username = ?', [username]);
  if (users.length === 0) return null;
  
  const user = users[0].values[0];
  const isValid = await bcrypt.compare(password, user[2]); // password is index 2
  
  return isValid ? user : null;
}
```

**Update `public/login.html` - No changes needed!**

---

### Step 2: Input Validation (2 hours)

```bash
npm install validator
```

**Create `utils/validation.js`:**

```javascript
const validator = require('validator');

function validateStudent(data) {
  const errors = [];
  
  if (!data.no_pendaftaran || !validator.isNumeric(data.no_pendaftaran)) {
    errors.push('No. Pendaftaran harus berupa angka');
  }
  
  if (!data.nama_murid || !validator.isLength(data.nama_murid, { min: 2, max: 100 })) {
    errors.push('Nama murid harus 2-100 karakter');
  }
  
  if (!data.nama_orang_tua || !validator.isLength(data.nama_orang_tua, { min: 2, max: 100 })) {
    errors.push('Nama orang tua harus 2-100 karakter');
  }
  
  return errors;
}

module.exports = { validateStudent };
```

**Update `netlify/functions/students.js`:**

```javascript
const { validateStudent } = require('../../utils/validation');

// In POST handler
const errors = validateStudent(JSON.parse(event.body));
if (errors.length > 0) {
  return {
    statusCode: 400,
    body: JSON.stringify({ errors })
  };
}
```

---

### Step 3: Environment Variables (1 hour)

```bash
npm install dotenv
```

**Create `.env`:**

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=change-this-to-random-string-min-32-chars
DB_PATH=./data/antrian.db
```

**Update `server-local.js`:**

```javascript
require('dotenv').config();

const PORT = process.env.PORT || 8888;
```

**Update `.gitignore`:**

```
.env
```

---

### Step 4: Rate Limiting (1 hour)

```bash
npm install express-rate-limit express
```

**Update `server-local.js` to use Express:**

```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Body parser
app.use(express.json());

// API routes
app.all('/api/students*', async (req, res) => {
  const event = {
    httpMethod: req.method,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : null
  };
  
  const response = await studentsHandler(event);
  res.status(response.statusCode).json(JSON.parse(response.body));
});

// Static files
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
```

---

## 🚀 Priority 2: Performance (MEDIUM - 1 Day)

### Step 1: Database Connection Pooling (2 hours)

**Create `utils/database.js`:**

```javascript
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let dbConnection = null;
let SQL = null;

async function getDB() {
  if (!dbConnection) {
    if (!SQL) {
      SQL = await initSqlJs();
    }
    
    const dbPath = path.join(__dirname, '../data/antrian.db');
    const buffer = fs.readFileSync(dbPath);
    dbConnection = new SQL.Database(buffer);
  }
  
  return dbConnection;
}

function saveDB(db) {
  const dbPath = path.join(__dirname, '../data/antrian.db');
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

module.exports = { getDB, saveDB };
```

**Update all API functions:**

```javascript
const { getDB, saveDB } = require('../../utils/database');

// Instead of:
const buffer = fs.readFileSync(dbPath);
const db = new SQL.Database(buffer);

// Use:
const db = await getDB();

// After updates:
saveDB(db);
```

---

### Step 2: Caching (2 hours)

```bash
npm install node-cache
```

**Create `utils/cache.js`:**

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // 60 seconds

function getCached(key) {
  return cache.get(key);
}

function setCached(key, value) {
  cache.set(key, value);
}

function invalidate(key) {
  cache.del(key);
}

module.exports = { getCached, setCached, invalidate };
```

**Update `netlify/functions/students.js`:**

```javascript
const { getCached, setCached, invalidate } = require('../../utils/cache');

// GET handler
const cached = getCached('students');
if (cached) {
  return {
    statusCode: 200,
    body: JSON.stringify(cached)
  };
}

// ... fetch from DB
setCached('students', students);

// PUT/POST/DELETE handlers
invalidate('students');
```

---

### Step 3: Compression (30 minutes)

```bash
npm install compression
```

**Update `server-local.js`:**

```javascript
const compression = require('compression');

app.use(compression());
```

---

## 🧪 Priority 3: Testing (HIGH - 2 Days)

### Step 1: Setup Jest (1 hour)

```bash
npm install --save-dev jest supertest
```

**Create `jest.config.js`:**

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'netlify/functions/**/*.js',
    'utils/**/*.js'
  ],
  testMatch: ['**/tests/**/*.test.js']
};
```

**Update `package.json`:**

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

### Step 2: Write Basic Tests (3 hours)

**Create `tests/students.test.js`:**

```javascript
const { handler } = require('../netlify/functions/students');

describe('Students API', () => {
  test('GET returns array of students', async () => {
    const event = {
      httpMethod: 'GET',
      headers: {},
      body: null
    };
    
    const response = await handler(event);
    
    expect(response.statusCode).toBe(200);
    const students = JSON.parse(response.body);
    expect(Array.isArray(students)).toBe(true);
  });
  
  test('POST creates new student', async () => {
    const event = {
      httpMethod: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        no_pendaftaran: '999',
        nama_murid: 'Test Student',
        nama_orang_tua: 'Test Parent',
        jenis_kelamin: 'Laki-laki'
      })
    };
    
    const response = await handler(event);
    expect(response.statusCode).toBe(201);
  });
  
  test('PUT updates student location', async () => {
    const event = {
      httpMethod: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        lokasi: 'tunggu1'
      })
    };
    
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
  });
});
```

**Run tests:**

```bash
npm test
```

---

## 💾 Priority 4: Automated Backups (CRITICAL - 1 Hour)

### Setup Systemd Timer

**Create `/etc/systemd/system/antrian-backup.service`:**

```ini
[Unit]
Description=Antrian Database Backup

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/var/www/antrian-test
ExecStart=/var/www/antrian-test/backup-db.sh
```

**Create `/etc/systemd/system/antrian-backup.timer`:**

```ini
[Unit]
Description=Run Antrian Backup Daily at 2 AM

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
```

**Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable antrian-backup.timer
sudo systemctl start antrian-backup.timer

# Check status
sudo systemctl status antrian-backup.timer
sudo systemctl list-timers
```

---

## 📊 Priority 5: Logging (MEDIUM - 2 Hours)

### Setup Winston Logger

```bash
npm install winston
```

**Create `utils/logger.js`:**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Usage:**

```javascript
const logger = require('./utils/logger');

// Instead of console.log
logger.info('Student created', { id: student.id, name: student.nama_murid });
logger.error('Database error', { error: err.message, stack: err.stack });
logger.warn('Pool Test full', { count: poolCount });
```

---

## 🎯 Implementation Checklist

### Week 1: Critical Security
- [ ] Install bcryptjs
- [ ] Hash passwords in users API
- [ ] Add input validation
- [ ] Setup environment variables
- [ ] Add rate limiting
- [ ] Test login with hashed passwords

### Week 2: Performance & Testing
- [ ] Implement database connection pooling
- [ ] Add caching layer
- [ ] Enable compression
- [ ] Setup Jest
- [ ] Write unit tests (80% coverage)
- [ ] Run tests in CI/CD

### Week 3: Monitoring & Backups
- [ ] Setup Winston logger
- [ ] Replace console.log with logger
- [ ] Setup automated backups
- [ ] Add health check endpoint
- [ ] Test backup restoration

---

## 🚀 Quick Start Commands

```bash
# Install all dependencies
npm install bcryptjs validator dotenv express-rate-limit express node-cache compression winston jest supertest --save

# Run tests
npm test

# Start with new improvements
npm start

# Check logs
tail -f logs/combined.log
```

---

## 📝 Notes

1. **Backup database** before implementing changes
2. **Test locally** before deploying to VPS
3. **Update documentation** after each improvement
4. **Monitor logs** for errors after deployment
5. **Run tests** before every git push

---

## 🆘 Troubleshooting

### bcrypt installation fails
```bash
npm install bcryptjs --build-from-source
```

### Tests fail
```bash
# Clear cache
npm test -- --clearCache

# Run with verbose
npm test -- --verbose
```

### Rate limiting too strict
```bash
# Adjust in server-local.js
max: 200 // increase limit
```

---

**Ready to implement? Start with Priority 1!** 🚀
