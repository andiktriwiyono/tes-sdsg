# 🛑 Fitur Istirahat Meja Penguji

## Overview
Fitur yang memungkinkan penguji untuk set meja mereka ke mode istirahat.

## Status
✅ **COMPLETED** - Backend dan frontend sudah siap untuk production

---

## ✅ Yang Sudah Selesai

### 1. Database Migration
- ✅ Script `add-break-status.js` untuk menambahkan kolom `is_break` ke tabel teachers
- ✅ Kolom `is_break`: 0 = Aktif, 1 = Istirahat
- ✅ Command: `npm run add-break`

### 2. API Endpoint
- ✅ GET `/api/teachers` - Mengembalikan status `is_break` untuk setiap meja
- ✅ PUT `/api/teachers` dengan `action: 'toggle_break'` - Toggle status istirahat

**Request Example:**
```javascript
fetch('/api/teachers', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'toggle_break',
    meja_number: 1,
    is_break: true  // true = istirahat, false = aktif
  })
})
```

### 3. Frontend UI
- ✅ Toggle button "Istirahat/Aktifkan" di header meja (hanya untuk penguji)
- ✅ Badge status "🛑 Istirahat" atau "✅ Aktif" di setiap meja
- ✅ Konfirmasi dialog saat toggle istirahat
- ✅ Warning jika ada siswa sedang test saat set istirahat

### 4. Logika Ploting
- ✅ Koordinator tidak bisa ploting siswa ke meja yang istirahat
- ✅ Button ploting disabled dengan icon 🛑 untuk meja istirahat
- ✅ Pesan error jika coba ploting ke meja istirahat
- ✅ Counter meja tersedia memperhitungkan meja istirahat

### 5. Validasi
- ✅ Double-check status istirahat di fungsi `plotingStudent()`
- ✅ Pesan error yang jelas untuk user

---

## 📋 Cara Menggunakan (Setelah Selesai)

### Untuk Penguji:
1. Login sebagai penguji (PENGUJI_MEJA_1 sampai PENGUJI_MEJA_5)
2. Klik tombol "Istirahat" di header meja
3. Meja akan berubah status menjadi istirahat
4. Koordinator tidak bisa ploting siswa baru ke meja
5. Klik lagi untuk aktifkan kembali

### Untuk Koordinator:
1. Lihat badge status di setiap meja
2. Meja dengan badge "🛑 Istirahat" tidak bisa terima siswa
3. Button ploting akan disabled untuk meja istirahat

---

## 🔧 Deployment ke VPS

```bash
cd /var/www/antrian-test
git pull origin main

# Jalankan migration
npm run add-break

# Restart server
pm2 restart antrian-test
```

---

## 📊 Database Schema

```sql
ALTER TABLE teachers ADD COLUMN is_break INTEGER DEFAULT 0;
```

**Values:**
- `0` = Meja aktif (default)
- `1` = Meja istirahat

---

## 🎯 Use Cases

### Use Case 1: Penguji Butuh Istirahat
1. Penguji selesaikan test siswa yang sedang berlangsung
2. Klik tombol "Istirahat"
3. Meja tidak terima siswa baru
4. Penguji bisa istirahat
5. Setelah istirahat, klik "Aktif" lagi

### Use Case 2: Koordinator Lihat Status
1. Koordinator lihat Pool Test
2. Ada siswa siap di-ploting
3. Cek meja mana yang aktif (tidak istirahat)
4. Ploting ke meja yang aktif saja

### Use Case 3: Meja Penuh + Ada yang Istirahat
1. 5 meja, 2 meja istirahat
2. Hanya 3 meja aktif yang bisa terima siswa
3. Koordinator ploting ke 3 meja aktif
4. Siswa lain tunggu di Pool Test

---

## 🔄 Status Update

**Last Updated:** 2026-02-11

**Progress:**
- ✅ Backend API (100%)
- ✅ Frontend UI (100%)
- ⏳ Testing (Pending deployment to VPS)

**Commits:**
- `aeb76d2` - Add break status feature for teachers - backend API and database migration
- `1e75c23` - Add break feature frontend: toggle button for penguji and break status validation for ploting

**Next Steps:**
1. Deploy ke VPS
2. Run migration: `npm run add-break`
3. Test fitur dengan login sebagai penguji
4. Test ploting dengan koordinator
