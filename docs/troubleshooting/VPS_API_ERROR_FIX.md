# 🔧 Fix API Error & Login di VPS

## ❌ Error yang Terjadi

```
Error loading users: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

**Gejala:**
- Login tidak bisa untuk semua user
- Console browser menunjukkan error JSON parse
- API mengembalikan HTML bukan JSON

---

## 🔍 Penyebab

1. **Database belum dimigrasi** (paling sering!)
2. API endpoint tidak bisa diakses
3. Server configuration issue
4. PM2 tidak running dengan benar

---

## ✅ Solusi Lengkap

### Step 1: Cek Status PM2

```bash
# Login ke VPS
ssh root@your-vps-ip

# Masuk ke folder aplikasi
cd /var/www/antrian-test

# Cek status PM2
pm2 status
```

**Output yang diharapkan:**
```
┌─────┬──────────────┬─────────┬─────────┬─────────┐
│ id  │ name         │ status  │ restart │ uptime  │
├─────┼──────────────┼─────────┼─────────┼─────────┤
│ 0   │ antrian-test │ online  │ 0       │ 5m      │
└─────┴──────────────┴─────────┴─────────┴─────────┘
```

**Jika status "errored" atau "stopped":**
```bash
# Lihat logs error
pm2 logs antrian-test --err --lines 50

# Restart
pm2 restart antrian-test
```

---

### Step 2: Migrasi Database (PENTING!)

```bash
cd /var/www/antrian-test

# Cek apakah database ada
ls -la data/antrian.db

# Jika tidak ada atau error, jalankan migrasi
node scripts/migrate-db-vps.js
```

**Output yang diharapkan:**
```
🚀 Memulai migrasi database...

1️⃣  Membuat tabel students...
   ✅ Tabel students siap

2️⃣  Membuat tabel users...
   ✅ Tabel users siap

...

✅ MIGRASI DATABASE SELESAI!

📋 Ringkasan:
   - Database: /var/www/antrian-test/data/antrian.db
   - Users: 9 baru ditambahkan
   - Teachers: 10 baru ditambahkan

🔐 Login credentials:
   Username: admin
   Password: admin123
```

---

### Step 3: Set Permissions Database

```bash
# Set permissions yang benar
chmod 755 data
chmod 644 data/antrian.db

# Verifikasi permissions
ls -la data/
```

**Output yang diharapkan:**
```
drwxr-xr-x 2 root root  4096 Feb 10 10:00 .
drwxr-xr-x 8 root root  4096 Feb 10 10:00 ..
-rw-r--r-- 1 root root 12288 Feb 10 10:00 antrian.db
```

---

### Step 4: Restart PM2

```bash
# Restart aplikasi
pm2 restart antrian-test

# Lihat logs
pm2 logs antrian-test --lines 20
```

**Output yang diharapkan (tidak ada error):**
```
🚀 Server running at http://localhost:3000/
📊 API endpoint: http://localhost:3000/api/students
👥 Users API: http://localhost:3000/api/users
👨‍🏫 Teachers API: http://localhost:3000/api/teachers
```

---

### Step 5: Test API Endpoint

```bash
# Test API users
curl http://localhost:3000/api/users

# Atau dengan full URL
curl http://localhost:3000/.netlify/functions/users
```

**Output yang diharapkan (JSON):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "role": "ADMIN"
  },
  ...
]
```

**Jika output HTML (error):**
```html
<!doctype html>
...
```
Berarti API tidak berjalan dengan benar.

---

### Step 6: Cek Nginx Configuration

```bash
# Test Nginx config
sudo nginx -t

# Lihat Nginx error log
sudo tail -f /var/log/nginx/antrian-test-error.log
```

**Jika ada error, restart Nginx:**
```bash
sudo systemctl restart nginx
```

---

### Step 7: Verifikasi di Browser

1. **Buka browser:** `http://tes.sdsunangiri.sch.id`
2. **Buka Developer Console:** F12 atau Ctrl+Shift+I
3. **Lihat Network tab**
4. **Refresh halaman login**
5. **Cek request ke `/api/users` atau `/.netlify/functions/users`**

**Response yang diharapkan:**
- Status: 200 OK
- Content-Type: application/json
- Response: Array of users (JSON)

**Jika response HTML:**
- Berarti API tidak berjalan
- Kembali ke Step 1-4

---

## 🔧 Troubleshooting Lanjutan

### Error: "Cannot find module 'sql.js'"

```bash
cd /var/www/antrian-test
npm install
pm2 restart antrian-test
```

### Error: "EACCES: permission denied"

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/antrian-test

# Fix permissions
chmod 755 data
chmod 644 data/antrian.db
```

### Error: "Port 3000 already in use"

```bash
# Cek port yang digunakan
sudo netstat -tulpn | grep :3000

# Kill process
sudo kill -9 <PID>

# Restart PM2
pm2 restart antrian-test
```

### Database Corrupt

```bash
# Backup database lama
cp data/antrian.db data/antrian.db.corrupt

# Hapus database
rm data/antrian.db

# Migrasi ulang
node scripts/migrate-db-vps.js

# Restart
pm2 restart antrian-test
```

---

## 📋 Checklist Verifikasi

Setelah semua langkah di atas:

- [ ] PM2 status "online"
- [ ] Database file `data/antrian.db` ada
- [ ] Permissions database benar (644)
- [ ] `pm2 logs` tidak ada error
- [ ] `curl http://localhost:3000/api/users` return JSON
- [ ] Nginx tidak ada error
- [ ] Browser console tidak ada error
- [ ] Login dengan admin/admin123 berhasil

---

## 🎯 Quick Fix (All-in-One)

Jika masih bingung, jalankan semua command ini:

```bash
# Masuk ke folder
cd /var/www/antrian-test

# Install dependencies
npm install

# Migrasi database
node scripts/migrate-db-vps.js

# Set permissions
chmod 755 data
chmod 644 data/antrian.db

# Restart PM2
pm2 restart antrian-test

# Cek logs
pm2 logs antrian-test --lines 20

# Test API
curl http://localhost:3000/api/users

# Jika masih error, restart Nginx
sudo systemctl restart nginx
```

---

## 🔐 Test Login

Setelah semua fix, test login dengan:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| posruang | posruang123 | POS_RUANG |
| koordinator | koordinator123 | KOORDINATOR_RUANG_TEST |

---

## 📞 Masih Error?

Jika masih error setelah semua langkah di atas:

1. **Kirim logs PM2:**
   ```bash
   pm2 logs antrian-test --lines 100 > pm2-logs.txt
   cat pm2-logs.txt
   ```

2. **Kirim Nginx error log:**
   ```bash
   sudo tail -100 /var/log/nginx/antrian-test-error.log
   ```

3. **Cek browser console:**
   - F12 → Console tab
   - Screenshot error yang muncul

4. **Cek Network tab:**
   - F12 → Network tab
   - Refresh halaman
   - Klik request yang error
   - Screenshot Response

---

## 🔗 Link Terkait

- **Login Fix:** [VPS_LOGIN_FIX.md](VPS_LOGIN_FIX.md)
- **Deployment Guide:** [../deployment/DEPLOYMENT_GUIDE.md](../deployment/DEPLOYMENT_GUIDE.md)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

**Terakhir diupdate:** 10 Februari 2026
