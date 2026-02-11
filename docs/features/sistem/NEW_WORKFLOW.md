# 🔄 Alur Baru: Koordinator Plot → Petugas Antar

## 📋 Ringkasan Perubahan

Sistem sekarang menggunakan alur 2 tahap untuk memindahkan siswa dari Pool Test ke Meja Penguji:

### Alur Lama (Langsung):
```
Pool Test → Koordinator Klik Meja → Siswa Langsung di Meja
```

### Alur Baru (2 Tahap):
```
Pool Test → Koordinator Plot Meja → Petugas Antar Jemput & Antar → Siswa di Meja
```

---

## 🎯 Alur Lengkap

### **Fase 1: Koordinator Plot Meja**
1. Koordinator melihat siswa di Pool Test
2. Koordinator klik button "Plot M1" (atau M2-M5)
3. Siswa tetap di Pool Test dengan badge **"🚶 Diantar ke M1"**
4. Status siswa: `plot_meja = "meja-1"`, `status_antar = "menunggu-antar"`

### **Fase 2: Petugas Antar - Jemput & Antar**
1. Petugas Antar melihat siswa dengan badge "🚶 Diantar ke M1"
2. Petugas Antar klik button **"✓ Jemput & Antar ke M1"**
3. Siswa pindah ke Meja 1
4. Status siswa: `lokasi = "meja-1"`, `plot_meja = null`, `status_antar = null`

### **Fase 3: Penguji Test**
1. Penguji test siswa di Meja 1
2. Penguji klik button **"✓ Selesai Test"**
3. Siswa tetap di Meja 1 dengan status selesai
4. Status siswa: `sudah_test = 1`, `status_antar = "menunggu-jemput"`

### **Fase 4: Petugas Antar - Jemput & Kembalikan**
1. Petugas Antar melihat siswa selesai test di Meja 1
2. Petugas Antar klik button **"🔙 Kembalikan ke Ruang Tunggu 1"**
3. Siswa pindah ke Selesai Test (T1 atau T2)
4. Status siswa: `lokasi = "selesai-tunggu1"`, `status_antar = null`

---

## 🎨 UI untuk Setiap Role

### **1. Koordinator Dashboard**

**Pool Test - Siswa Belum di-plot:**
```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 🎯 Antrian 1 Antri Test                             │
│ Ahmad Rizki (Dari: Tunggu 1)                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔔 PLOT SISWA INI KE MEJA!                              │ │
│ │ Pilih meja tujuan:                                      │ │
│ │ [Plot M1] [Plot M2] [Plot M3] [Plot M4] [Plot M5]      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Pool Test - Siswa Sudah di-plot:**
```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 🚶 Diantar ke M1                                    │
│ Ahmad Rizki (Dari: Tunggu 1)                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✅ Sudah di-plot ke Meja 1                              │ │
│ │ 🚶 Menunggu Petugas Antar menjemput...                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### **2. Petugas Antar Dashboard**

**Pool Test - Siswa Menunggu Dijemput:**
```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 🚶 Diantar ke M1                                    │
│ Ahmad Rizki (Dari: Tunggu 1)                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🚶 JEMPUT & ANTAR!                                      │ │
│ │ Sudah di-plot ke Meja 1                                 │ │
│ │ [✓ Jemput & Antar ke M1]                                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Meja 1 - Siswa Selesai Test:**
```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 ✅ Selesai Test                                     │
│ Ahmad Rizki (Dari: Tunggu 1)                                │
│ ⏰ Selesai: 10:15:30                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔙 KEMBALIKAN KE RUANG ASAL                             │ │
│ │ Ke: Selesai Test (T1)                                   │ │
│ │ [🔙 Kembalikan ke Ruang Tunggu 1]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### **3. Penguji Dashboard**

**Meja - Siswa Sedang Test:**
```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 Sedang Test                                         │
│ Ahmad Rizki (Dari: Tunggu 1)                                │
│ ⏱️ Durasi: 5:23                                              │
│                                                             │
│ [✓ Selesai Test]                                            │
└─────────────────────────────────────────────────────────────┘
```

**Meja - Siswa Selesai Test:**
```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 ✅ Selesai Test                                     │
│ Ahmad Rizki (Dari: Tunggu 1)                                │
│ ⏰ Selesai: 10:15:30                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✅ Test Selesai                                          │ │
│ │ 🚶 Menunggu Petugas Antar menjemput...                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Fields

### Field Baru:
- `plot_meja`: Meja yang di-plot oleh koordinator (contoh: "meja-1")
- `status_antar`: Status untuk petugas antar
  - `"menunggu-antar"`: Siswa di Pool, sudah di-plot, menunggu dijemput
  - `"menunggu-jemput"`: Siswa di Meja, sudah selesai test, menunggu dijemput
  - `null`: Normal (tidak ada aksi petugas antar)

### Field yang Sudah Ada:
- `lokasi`: Lokasi siswa saat ini
- `lokasi_asal`: Asal siswa (tunggu1/tunggu2) untuk tahu kembalikan ke mana
- `sudah_test`: 0 = belum test, 1 = sudah test
- `test_start_time`: Waktu mulai test
- `test_end_time`: Waktu selesai test

---

## 🔄 Status Flow

```
1. Pool Test
   lokasi: "test"
   plot_meja: null
   status_antar: null
   
   ↓ Koordinator klik "Plot M1"
   
2. Pool Test (Menunggu Petugas Antar)
   lokasi: "test"
   plot_meja: "meja-1"
   status_antar: "menunggu-antar"
   
   ↓ Petugas Antar klik "Jemput & Antar"
   
3. Meja 1 (Sedang Test)
   lokasi: "meja-1"
   plot_meja: null
   status_antar: null
   sudah_test: 0
   
   ↓ Penguji klik "Selesai Test"
   
4. Meja 1 (Selesai Test, Menunggu Dijemput)
   lokasi: "meja-1"
   plot_meja: null
   status_antar: "menunggu-jemput"
   sudah_test: 1
   
   ↓ Petugas Antar klik "Kembalikan"
   
5. Selesai Test (T1)
   lokasi: "selesai-tunggu1"
   plot_meja: null
   status_antar: null
   sudah_test: 1
```

---

## ✅ Keuntungan Alur Baru

1. **Pembagian Tugas Jelas**
   - Koordinator: Fokus ploting/strategi
   - Petugas Antar: Fokus jemput & antar fisik
   - Penguji: Fokus test saja

2. **Tracking Lebih Baik**
   - Tahu siswa mana yang sudah di-plot
   - Tahu siswa mana yang menunggu dijemput
   - Tahu siswa mana yang sudah selesai test

3. **Fleksibilitas**
   - Koordinator bisa plot dulu, petugas antar nanti
   - Petugas antar bisa prioritas siswa tertentu
   - Penguji tidak perlu mikir logistik

4. **Real-time Status**
   - Badge visual untuk setiap status
   - Mudah monitor progress
   - Tidak ada siswa yang "hilang"

---

## 🧪 Testing Guide

### Test 1: Koordinator Plot Siswa
1. Login sebagai Koordinator
2. Lihat siswa di Pool Test (Antrian 1)
3. Klik button "Plot M1"
4. **Expected:** Siswa tetap di Pool dengan badge "🚶 Diantar ke M1"

### Test 2: Petugas Antar Jemput & Antar
1. Login sebagai Petugas Antar
2. Lihat siswa dengan badge "🚶 Diantar ke M1"
3. Klik button "✓ Jemput & Antar ke M1"
4. **Expected:** Siswa pindah ke Meja 1

### Test 3: Penguji Selesai Test
1. Login sebagai Penguji 1
2. Lihat siswa di Meja 1
3. Klik button "✓ Selesai Test"
4. **Expected:** Siswa tetap di Meja 1 dengan status selesai

### Test 4: Petugas Antar Kembalikan
1. Login sebagai Petugas Antar
2. Lihat siswa selesai test di Meja 1
3. Klik button "🔙 Kembalikan ke Ruang Tunggu 1"
4. **Expected:** Siswa pindah ke Selesai Test (T1)

---

## 📝 Migration Script

Untuk menambahkan field baru ke database:

```bash
node scripts/add-plot-meja-column.js
```

Script ini akan menambahkan:
- Kolom `plot_meja` (TEXT, default NULL)
- Kolom `status_antar` (TEXT, default NULL)

---

## 🚀 Deployment

Setelah pull dari GitHub di VPS:

```bash
cd /var/www/antrian-test
git pull origin main
node scripts/add-plot-meja-column.js  # Jalankan migration
pm2 restart antrian-test
```

---

**Implementasi Selesai!** ✅

Alur baru sudah siap digunakan dengan pembagian tugas yang lebih jelas antara Koordinator dan Petugas Antar.
