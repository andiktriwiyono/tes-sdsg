# 🔧 Fix Login Tidak Bisa di VPS

## ❌ Masalah
Setelah deploy ke VPS, semua login tidak bisa masuk. Kemungkinan besar **database belum dimigrasi**.

---

## ✅ Solusi Cepat

### 1. Login ke VPS
```bash
ssh root@your-vps-ip
# atau
ssh username@your-vps-ip
```

### 2. Masuk ke folder aplikasi
```bash
cd /var/www/antrian-test
```

### 3. Jalankan migrasi database

**Cara 1: Langsung jalankan script (RECOMMENDED)**
```bash
node scripts/migrate-db-vps.js
```

**Cara 2: Jika sudah git pull terbaru**
```bash
npm run migrate-vps
```

**Output yang diharapkan:**
```
🚀 Memulai migrasi database...

1️⃣  Membuat tabel students...
   ✅ Tabel students siap

2️⃣  Membuat tabel users...
   ✅ Tabel users siap

3️⃣  Membuat tabel teachers...
   ✅ Tabel teachers siap

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

### 4. Set permissions database
```bash
chmod 755 data
chmod 644 data/antrian.db
```

### 5. Restart aplikasi
```bash
pm2 restart antrian-test
```

### 6. Test login
Buka browser dan akses: `http://tes.sdsunangiri.sch.id`

Login dengan:
- **Username:** `admin`
- **Password:** `admin123`

---

## 🔍 Verifikasi Database

### Cek apakah database ada
```bash
ls -la data/
```

**Output yang diharapkan:**
```
-rw-r--r-- 1 user user 12288 Feb 10 10:00 antrian.db
```

### Cek isi database (opsional)
```bash
# Install sqlite3 jika belum ada
sudo apt install -y sqlite3

# Cek tabel users
sqlite3 data/antrian.db "SELECT username, role FROM users;"
```

**Output yang diharapkan:**
```
admin|ADMIN
posruang|POS_RUANG
koordinator|KOORDINATOR_RUANG_TEST
petugasantar|PETUGAS_ANTAR
penguji1|PENGUJI_MEJA_1
penguji2|PENGUJI_MEJA_2
penguji3|PENGUJI_MEJA_3
penguji4|PENGUJI_MEJA_4
penguji5|PENGUJI_MEJA_5
```

---

## 🚨 Troubleshooting

### Error: "Cannot find module 'sql.js'"
```bash
# Install dependencies
npm install
```

### Error: "EACCES: permission denied"
```bash
# Fix permissions
sudo chown -R $USER:$USER /var/www/antrian-test
chmod 755 data
chmod 644 data/antrian.db
```

### Database sudah ada tapi login tetap gagal
```bash
# Backup database lama
cp data/antrian.db data/antrian.db.backup

# Hapus database lama
rm data/antrian.db

# Jalankan migrasi lagi
npm run migrate-vps

# Restart aplikasi
pm2 restart antrian-test
```

### Cek logs aplikasi
```bash
# Lihat logs PM2
pm2 logs antrian-test

# Lihat logs Nginx
sudo tail -f /var/log/nginx/antrian-test-error.log
```

---

## 📋 Checklist Setelah Migrasi

- [ ] Database file `data/antrian.db` sudah ada
- [ ] Permissions database sudah benar (644)
- [ ] PM2 status "online"
- [ ] Tidak ada error di `pm2 logs`
- [ ] Login dengan admin/admin123 berhasil
- [ ] Dashboard muncul dengan benar
- [ ] Semua role user bisa login

---

## 🔐 Default User Credentials

Setelah migrasi berhasil, gunakan kredensial berikut untuk login:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| posruang | posruang123 | POS_RUANG |
| koordinator | koordinator123 | KOORDINATOR_RUANG_TEST |
| petugasantar | petugasantar123 | PETUGAS_ANTAR |
| penguji1 | penguji123 | PENGUJI_MEJA_1 |
| penguji2 | penguji123 | PENGUJI_MEJA_2 |
| penguji3 | penguji123 | PENGUJI_MEJA_3 |
| penguji4 | penguji123 | PENGUJI_MEJA_4 |
| penguji5 | penguji123 | PENGUJI_MEJA_5 |

⚠️ **PENTING:** Ganti password admin setelah login pertama kali!

---

## 🔄 Workflow Deployment yang Benar

Untuk deployment selanjutnya, ikuti urutan ini:

```bash
# 1. Clone repository
git clone https://github.com/username/antrian-test.git .

# 2. Install dependencies
npm install

# 3. Migrasi database (PENTING!)
npm run migrate-vps

# 4. Set permissions
chmod 755 data
chmod 644 data/antrian.db

# 5. Start aplikasi
pm2 start ecosystem.config.js

# 6. Setup auto-start
pm2 startup
pm2 save
```

---

## 📞 Masih Bermasalah?

Jika masih tidak bisa login setelah mengikuti langkah di atas:

1. **Cek PM2 logs:**
   ```bash
   pm2 logs antrian-test --lines 50
   ```

2. **Cek Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/antrian-test-error.log
   ```

3. **Restart semua:**
   ```bash
   pm2 restart antrian-test
   sudo systemctl restart nginx
   ```

4. **Verifikasi database:**
   ```bash
   sqlite3 data/antrian.db "SELECT COUNT(*) FROM users;"
   # Harus return: 9
   ```

---

**Selamat! Login sekarang seharusnya sudah bisa berfungsi** ✅
