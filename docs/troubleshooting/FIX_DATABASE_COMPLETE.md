# 🔧 Fix Database Complete

Script untuk memperbaiki database secara menyeluruh.

---

## ❌ Masalah yang Diperbaiki

1. **Import siswa gagal** - Error 500 saat import
2. **Data guru tidak muncul** - Guru tidak tampil di meja penguji
3. **Struktur database tidak konsisten** - Kolom hilang atau tidak sesuai
4. **Data corrupt** - Database rusak atau error

---

## ✅ Apa yang Dilakukan Script Ini?

1. **Backup data lama** - Simpan semua data siswa, users, dan teachers
2. **Drop tabel lama** - Hapus tabel dengan struktur lama
3. **Buat tabel baru** - Buat tabel dengan struktur lengkap dan benar
4. **Restore data** - Kembalikan data lama ke tabel baru
5. **Insert default data** - Tambah users dan teachers default jika belum ada

---

## 🚀 Cara Menggunakan

### Di VPS:

```bash
# 1. Login ke VPS
ssh root@your-vps-ip

# 2. Masuk ke folder aplikasi
cd /var/www/antrian-test

# 3. Backup database (PENTING!)
cp data/antrian.db data/antrian.db.backup-$(date +%Y%m%d-%H%M%S)

# 4. Jalankan fix database
npm run fix-db

# 5. Set permissions
chmod 644 data/antrian.db

# 6. Restart PM2
pm2 restart antrian-test

# 7. Test
curl http://localhost:8888/api/users | head -c 200
curl http://localhost:8888/api/teachers | head -c 200
```

---

## 📊 Output yang Diharapkan

```
🔧 Memulai perbaikan database lengkap...

📦 Database ditemukan, akan diperbaiki...

💾 Backup data lama...
   ✅ Backup 50 siswa
   ✅ Backup 9 users
   ✅ Backup 10 teachers

🗑️  Menghapus tabel lama...
   ✅ Tabel lama dihapus

1️⃣  Membuat tabel students dengan struktur lengkap...
   ✅ Tabel students siap

2️⃣  Membuat tabel users...
   ✅ Tabel users siap

3️⃣  Membuat tabel teachers...
   ✅ Tabel teachers siap

📥 Restore data siswa lama...
   ✅ Restore 50 siswa

📥 Restore data users lama...
   ✅ Restore 9 users

📥 Restore data teachers lama...
   ✅ Restore 10 teachers

✅ DATABASE BERHASIL DIPERBAIKI!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RINGKASAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊 Total Siswa: 50
   👥 Total Users: 9
   👨‍🏫 Total Teachers: 10

🔐 Login Credentials:
   Username: admin
   Password: admin123

⚠️  PENTING:
   1. Restart PM2: pm2 restart antrian-test
   2. Test login di browser
   3. Test import data siswa
   4. Cek data guru di meja penguji
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔍 Verifikasi Setelah Fix

### 1. Cek Struktur Tabel

```bash
sqlite3 data/antrian.db "PRAGMA table_info(students);"
```

**Harus ada kolom:**
- id, no_pendaftaran, nama_murid, jenis_kelamin, nama_orang_tua
- status, lokasi, lokasi_asal, sudah_test
- test_start_time, test_end_time
- pool_entry_time, tunggu1_entry_time, tunggu2_entry_time
- menunggu_dijemput, target_meja
- created_at, updated_at, meja_asal
- **sesi, escort_name, escort_phone** ← Kolom baru

### 2. Cek Data Users

```bash
sqlite3 data/antrian.db "SELECT username, role FROM users;"
```

**Harus ada 9 users:**
- admin (ADMIN)
- posruang (POS_RUANG)
- koordinator (KOORDINATOR_RUANG_TEST)
- petugasantar (PETUGAS_ANTAR)
- penguji1-5 (PENGUJI_MEJA_1-5)

### 3. Cek Data Teachers

```bash
sqlite3 data/antrian.db "SELECT meja_number, teacher_name FROM teachers ORDER BY meja_number, position;"
```

**Harus ada 10 teachers:**
- Meja 1: Guru 1A, Guru 1B
- Meja 2: Guru 2A, Guru 2B
- Meja 3: Guru 3A, Guru 3B
- Meja 4: Guru 4A, Guru 4B
- Meja 5: Guru 5A, Guru 5B

### 4. Test API

```bash
# Test users API
curl http://localhost:8888/api/users

# Test teachers API
curl http://localhost:8888/api/teachers

# Test students API
curl http://localhost:8888/api/students
```

Semua harus return JSON (tidak ada error).

### 5. Test di Browser

1. **Login:** `http://tes.sdsunangiri.sch.id`
   - Username: admin
   - Password: admin123

2. **Cek Meja Penguji:**
   - Harus tampil nama guru di setiap meja
   - Contoh: "Meja 1 - Guru 1A & Guru 1B"

3. **Test Import:**
   - Buka Admin Panel
   - Download template
   - Isi data siswa
   - Import
   - Harus berhasil tanpa error 500

---

## 🆘 Troubleshooting

### Error: "Cannot find module 'sql.js'"

```bash
npm install
npm run fix-db
```

### Error: "EACCES: permission denied"

```bash
sudo chown -R $USER:$USER /var/www/antrian-test
chmod 644 data/antrian.db
npm run fix-db
```

### Data Siswa Hilang Setelah Fix

```bash
# Restore dari backup
cp data/antrian.db.backup-YYYYMMDD-HHMMSS data/antrian.db
chmod 644 data/antrian.db
pm2 restart antrian-test
```

### Teachers Masih Tidak Muncul

```bash
# Cek API teachers
curl http://localhost:8888/api/teachers

# Jika kosong, insert manual
sqlite3 data/antrian.db <<EOF
INSERT INTO teachers (meja_number, teacher_name, position, created_at) VALUES
(1, 'Guru 1A', 1, datetime('now')),
(1, 'Guru 1B', 2, datetime('now')),
(2, 'Guru 2A', 1, datetime('now')),
(2, 'Guru 2B', 2, datetime('now')),
(3, 'Guru 3A', 1, datetime('now')),
(3, 'Guru 3B', 2, datetime('now')),
(4, 'Guru 4A', 1, datetime('now')),
(4, 'Guru 4B', 2, datetime('now')),
(5, 'Guru 5A', 1, datetime('now')),
(5, 'Guru 5B', 2, datetime('now'));
EOF

pm2 restart antrian-test
```

---

## 📝 Catatan Penting

1. **Selalu backup database** sebelum menjalankan fix
2. **Script ini aman** - data lama akan di-restore
3. **Jika ada error** - restore dari backup
4. **Setelah fix** - restart PM2 dan test semua fitur
5. **Jika masih error** - kirim PM2 logs untuk analisa

---

## 🔗 Link Terkait

- **VPS Login Fix:** [VPS_LOGIN_FIX.md](VPS_LOGIN_FIX.md)
- **API Error Fix:** [VPS_API_ERROR_FIX.md](VPS_API_ERROR_FIX.md)
- **Deployment Guide:** [../deployment/DEPLOYMENT_GUIDE.md](../deployment/DEPLOYMENT_GUIDE.md)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

**Terakhir diupdate:** 10 Februari 2026
