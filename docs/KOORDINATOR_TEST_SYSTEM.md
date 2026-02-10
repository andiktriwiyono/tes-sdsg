# 🎯 Sistem Koordinator Test

## ✅ Implementasi Selesai

Berdasarkan permintaan Anda, saya telah mengimplementasikan:

1. ✅ **Label "Antri Test"** untuk Pool Ruang Test
2. ✅ **Label "Sedang Test"** untuk Meja 1-5 (tetap)
3. ✅ **Role KOORDINATOR_TEST** dengan kemampuan assign siswa ke meja
4. ✅ **Pengingat Visual** untuk siswa Antrian 1 yang harus dijemput

---

## 🎯 Role Baru: 3 Role Terpisah

### 1️⃣ KOORDINATOR_LAPANGAN (Jemput & Antar)

**Login Account:**
- **Username:** `koordinator`
- **Password:** `koordinator123`

**Akses:**
- ✅ Lihat **Pool Ruang Test** (semua siswa yang antri)
- ✅ Lihat **Semua Meja Penguji** (Meja 1-5) - untuk tahu meja mana yang kosong
- ❌ Tidak bisa lihat: Daftar Siswa, Tunggu 1/2, Selesai Test

**Tugas:**
- **Jemput siswa** dari Pool Test (Antrian 1)
- **Antar siswa** ke meja penguji yang kosong
- **Monitor** status semua meja (kosong/terisi)

---

### 2️⃣ PENGUJI (Meja 1-5) - Fokus Test Saja

**Login Account:**
- **Username:** `penguji1` - `penguji5`
- **Password:** `penguji123`

**Akses:**
- ✅ Lihat **Meja sendiri** saja (Penguji 1 hanya lihat Meja 1)
- ❌ Tidak bisa lihat: Pool Test, Meja lain, Selesai Test

**Tugas:**
- **Test siswa** yang sudah di-assign oleh Koordinator Lapangan
- **Klik "✓ Selesai Test"** setelah test selesai
- **Fokus test saja** - tidak perlu monitor Pool atau assign siswa

---

### 3️⃣ ADMIN_CHECKLIST (Checklist Selesai Test)

**Login Account:**
- **Username:** `checklist`
- **Password:** `checklist123`

**Akses:**
- ✅ Lihat **Selesai Test** (T1/T2) - semua siswa yang sudah selesai test
- ✅ Bisa **checklist** bahwa siswa sudah selesai dan boleh pulang
- ❌ Tidak bisa lihat: Pool Test, Meja 1-5, Daftar Siswa

**Tugas:**
- **Checklist siswa** yang sudah selesai test
- **Verifikasi** siswa sudah lengkap (dokumen, dll)
- **Izinkan siswa pulang** setelah checklist

---

## 📋 Perubahan Label Status

### Pool Ruang Test:
- **Sebelum:** "Sedang Test" ❌
- **Sesudah:** "**Antri Test**" ✅

### Meja 1-5:
- **Tetap:** "**Sedang Test**" ✅

---

## 🔔 Pengingat Visual untuk Koordinator

### Siswa Antrian 1 (Harus Dijemput):

```
┌─────────────────────────────────────────────────────────────┐
│ #001 👦 Laki-laki 🎯 Antrian 1 Antri Test                   │
│ Ahmad Rizki                                                 │
│ 👨‍👩‍👧 Bapak Rizki                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔔 JEMPUT SISWA INI!                                    │ │ ← PENGINGAT
│ │ Antrian pertama - Pilih meja tujuan:                    │ │
│ │ [M1] [M2] [M3] [M4] [M5]                                │ │ ← 5 Button
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Fitur:**
- 🔔 **Badge "JEMPUT SISWA INI!"** dengan background hijau
- 🎯 **5 Button** untuk assign ke Meja 1-5
- ✅ **Hanya Antrian 1** yang bisa dijemput (FIFO strict)

### Siswa Antrian 2+ (Belum Bisa Dijemput):

```
┌─────────────────────────────────────────────────────────────┐
│ #002 👧 Perempuan ⏳ Antrian 2 Antri Test                   │
│ Siti Aminah                                                 │
│ 👨‍👩‍👧 Ibu Siti                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⏳ Antrian ke-2                                          │ │
│ │ Jemput siswa Antrian 1 terlebih dahulu                  │ │ ← Info
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Baru (3 Role Terpisah)

### Alur Lengkap:

```
DAFTAR SISWA
    ↓ (POS_RUANG: Manual move)
RUANG TUNGGU 1/2
    ↓ (SISTEM: Auto-move 10 detik)
POOL RUANG TEST (Antri Test)
    ↓ (KOORDINATOR_LAPANGAN: Jemput & Antar ke Meja)
MEJA 1-5 (Sedang Test)
    ↓ (PENGUJI: Test & Klik Selesai)
SELESAI TEST (T1/T2)
    ↓ (ADMIN_CHECKLIST: Checklist & Izinkan Pulang)
SISWA PULANG
```

### Detail Workflow per Role:

#### 1️⃣ Koordinator Lapangan:

1. **Login** (`koordinator` / `koordinator123`)
2. **Lihat Pool Test** - Ada siswa antri
3. **Identifikasi Antrian 1** - Badge hijau "🔔 JEMPUT SISWA INI!"
4. **Cek Meja Kosong** - Lihat Meja 1-5, pilih yang kosong
5. **Klik Button Meja** - Misal klik "M1" untuk Meja 1
6. **Siswa Pindah** - Otomatis ke Meja 1 dengan status "Sedang Test"
7. **Repeat** - Jemput siswa berikutnya dari Pool

#### 2️⃣ Penguji (Meja 1-5):

1. **Login** (`penguji1` / `penguji123`)
2. **Lihat Meja Sendiri** - Hanya lihat Meja 1 (untuk Penguji 1)
3. **Tunggu Siswa** - Koordinator akan antar siswa ke meja
4. **Test Siswa** - Fokus test saja
5. **Klik "✓ Selesai Test"** - Setelah test selesai
6. **Siswa Pindah** - Otomatis ke "Selesai Test"
7. **Repeat** - Tunggu siswa berikutnya dari Koordinator

#### 3️⃣ Admin Checklist:

1. **Login** (`checklist` / `checklist123`)
2. **Lihat Selesai Test** - Semua siswa yang sudah selesai test
3. **Verifikasi Siswa** - Cek dokumen, kelengkapan, dll
4. **Checklist Siswa** - Klik "✓ Checklist Selesai"
5. **Izinkan Pulang** - Siswa boleh pulang
6. **Repeat** - Checklist siswa berikutnya

---

## 🎯 Perbandingan: Sebelum vs Sesudah

### ❌ Sebelum (Penguji Multitasking):

```
POOL TEST (5 siswa)
    ↓ PENGUJI: Claim siswa sendiri
    ↓ Penguji monitor Pool Test
    ↓ Penguji test siswa
    ↓ Penguji checklist selesai
SELESAI TEST
```

**Masalah:**
- Penguji harus multitasking (monitor, claim, test, checklist)
- Tidak ada koordinasi terpusat
- Penguji tidak fokus test

---

### ✅ Sesudah (3 Role Terpisah):

```
POOL TEST (5 siswa)
    ↓ KOORDINATOR LAPANGAN: Jemput & antar
MEJA 1-5
    ↓ PENGUJI: Fokus test saja
SELESAI TEST
    ↓ ADMIN CHECKLIST: Checklist & izinkan pulang
SISWA PULANG
```

**Keuntungan:**
- ✅ **Koordinator Lapangan**: Fokus jemput & antar siswa
- ✅ **Penguji**: Fokus test saja, tidak perlu monitor Pool
- ✅ **Admin Checklist**: Fokus verifikasi & checklist selesai
- ✅ **Pembagian tugas jelas** - setiap role punya tugas spesifik
- ✅ **Lebih efisien** - tidak ada multitasking
- ✅ **FIFO tetap terjaga** - Koordinator enforce antrian

---

## 📱 UI untuk 3 Role

### 1️⃣ Koordinator Lapangan Dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Koordinator Lapangan                                     │
│ koordinator                                                 │
│ [Logout]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📝 Pool Ruang Test [3/5]                                    │
│ Antri Test - Menunggu dijemput (Max 5 siswa)               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ #001 👦 🎯 Antrian 1 Antri Test                         │ │
│ │ Ahmad Rizki                                             │ │
│ │ 🔔 JEMPUT SISWA INI!                                    │ │
│ │ Pilih meja tujuan:                                      │ │
│ │ [M1] [M2] [M3] [M4] [M5]                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ #002 👧 ⏳ Antrian 2 Antri Test                         │ │
│ │ Siti Aminah                                             │ │
│ │ ⏳ Jemput siswa Antrian 1 terlebih dahulu               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ Meja 1   │ Meja 2   │ Meja 3   │ Meja 4   │ Meja 5   │
│ [Kosong] │ [1 siswa]│ [Kosong] │ [1 siswa]│ [Kosong] │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

### 2️⃣ Penguji Dashboard (Fokus Test):

```
┌─────────────────────────────────────────────────────────────┐
│ 👨‍🏫 Penguji 1                                                │
│ penguji1                                                    │
│ [Logout]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📝 Meja 1 [1/1]                                             │
│ Sedang Test                                                 │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ #001 👦 Laki-laki Sedang Test                           │ │
│ │ Ahmad Rizki                                             │ │
│ │ 👨‍👩‍👧 Bapak Rizki                                          │ │
│ │                                                         │ │
│ │ [✓ Selesai Test]                                        │ │ ← Fokus ini saja
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

ℹ️ Koordinator akan mengantar siswa berikutnya ke meja Anda
```

**Catatan:**
- Penguji **TIDAK lihat** Pool Test
- Penguji **TIDAK lihat** Meja lain
- Penguji **HANYA lihat** Meja sendiri
- Penguji **FOKUS test** siswa yang sudah di-assign

---

### 3️⃣ Admin Checklist Dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Admin Checklist                                          │
│ checklist                                                   │
│ [Logout]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📝 Selesai Test - Tunggu 1 [2]                              │
│ Siswa yang sudah selesai test                              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ #001 👦 Laki-laki Selesai Test                          │ │
│ │ Ahmad Rizki                                             │ │
│ │ 👨‍👩‍👧 Bapak Rizki                                          │ │
│ │ ⏰ Selesai: 10:15:30                                     │ │
│ │                                                         │ │
│ │ [✓ Checklist Selesai]                                   │ │ ← Checklist
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ #002 👧 Perempuan Selesai Test                          │ │
│ │ Siti Aminah                                             │ │
│ │ 👨‍👩‍👧 Ibu Siti                                             │ │
│ │ ⏰ Selesai: 10:18:45                                     │ │
│ │                                                         │ │
│ │ [✓ Checklist Selesai]                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📝 Selesai Test - Tunggu 2 [1]                              │
│ Siswa yang sudah selesai test                              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ #003 👦 Laki-laki Selesai Test                          │ │
│ │ Budi Santoso                                            │ │
│ │ [✓ Checklist Selesai]                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Catatan:**
- Admin Checklist **HANYA lihat** Selesai Test (T1/T2)
- Admin Checklist **TIDAK lihat** Pool Test atau Meja 1-5
- Admin Checklist **FOKUS** verifikasi & checklist siswa selesai

---

## 🔧 Perubahan Role & Permissions

### Role Baru:

| Role | Username | Akses |
|------|----------|-------|
| **KOORDINATOR_LAPANGAN** | koordinator | Pool Test + Semua Meja (untuk lihat yang kosong) |
| **PENGUJI** | penguji1-5 | Meja sendiri saja (tidak lihat Pool) |
| **ADMIN_CHECKLIST** | checklist | Selesai Test (T1/T2) saja |

---

### Perubahan Penguji:

#### Sebelum:
- Penguji bisa lihat **Pool Test** ✅
- Penguji bisa **claim siswa** sendiri ✅
- Penguji lihat **Meja sendiri** ✅
- Penguji **multitasking** (monitor, claim, test)

#### Sesudah:
- Penguji **TIDAK bisa lihat Pool Test** ❌
- Penguji **TIDAK bisa claim siswa** ❌
- Penguji **hanya lihat Meja sendiri** ✅
- Penguji **fokus test siswa** yang sudah di-assign oleh Koordinator
- Penguji **klik "✓ Selesai Test"** setelah test selesai

**Alasan:**
- Koordinator Lapangan yang handle semua assignment
- Penguji fokus test saja, tidak perlu monitor Pool
- Admin Checklist yang handle verifikasi selesai
- Lebih terorganisir dan efisien

---

### Role Baru: Admin Checklist

**Tugas:**
- Lihat siswa yang sudah selesai test (T1/T2)
- Verifikasi kelengkapan dokumen
- Checklist siswa sudah selesai
- Izinkan siswa pulang

**Tidak Bisa:**
- Tidak bisa lihat Pool Test
- Tidak bisa lihat Meja 1-5
- Tidak bisa assign siswa
- Fokus checklist saja

---

## 🎯 FIFO System (Tetap Ketat)

### Aturan:
1. **Hanya Antrian 1** yang bisa dijemput
2. **Antrian 2+** harus tunggu Antrian 1 dijemput dulu
3. **FIFO strict** - oldest first (by `pool_entry_time`)

### Contoh:

```
Pool Test:
  Siswa A: pool_entry_time = 10:00:00 → 🎯 Antrian 1 (bisa dijemput)
  Siswa B: pool_entry_time = 10:00:05 → ⏳ Antrian 2 (tunggu)
  Siswa C: pool_entry_time = 10:00:10 → ⏳ Antrian 3 (tunggu)

Koordinator jemput Siswa A → Assign ke Meja 1

Pool Test (update):
  Siswa B: pool_entry_time = 10:00:05 → 🎯 Antrian 1 (bisa dijemput)
  Siswa C: pool_entry_time = 10:00:10 → ⏳ Antrian 2 (tunggu)
```

---

## 📊 Dashboard Statistics

Koordinator bisa lihat:
- **Pool Test:** Jumlah siswa antri (0-5)
- **Meja 1-5:** Status setiap meja (kosong/terisi)
- **Capacity Badge:** [3/5] dengan color coding
  - Hijau (0-2): Banyak slot
  - Amber (3-4): Hampir penuh
  - Merah (5): PENUH!

---

## 🧪 Testing Guide

### Test 1: Login Koordinator Lapangan

1. Buka `/login.html`
2. Login: `koordinator` / `koordinator123`
3. **Expected:** Redirect ke dashboard
4. **Expected:** Lihat Pool Test + Semua Meja
5. **Expected:** TIDAK lihat Daftar, Tunggu 1/2, Selesai Test

### Test 2: Jemput Siswa Antrian 1

1. Login sebagai Koordinator Lapangan
2. Lihat Pool Test - ada siswa dengan badge "🔔 JEMPUT SISWA INI!"
3. Klik button "M1" (Meja 1)
4. **Expected:** Siswa pindah ke Meja 1
5. **Expected:** Status berubah "Sedang Test"
6. **Expected:** Siswa berikutnya jadi Antrian 1

### Test 3: Tidak Bisa Jemput Antrian 2+

1. Login sebagai Koordinator Lapangan
2. Lihat siswa Antrian 2
3. **Expected:** Tidak ada button M1-M5
4. **Expected:** Hanya info "⏳ Jemput siswa Antrian 1 terlebih dahulu"

### Test 4: Penguji Tidak Lihat Pool Test

1. Login sebagai `penguji1` / `penguji123`
2. **Expected:** Hanya lihat Meja 1
3. **Expected:** TIDAK lihat Pool Test
4. **Expected:** Fokus test siswa yang sudah di-assign

### Test 5: Penguji Selesai Test

1. Login sebagai `penguji1`
2. Ada siswa di Meja 1
3. Klik "✓ Selesai Test"
4. **Expected:** Siswa pindah ke "Selesai Test"
5. **Expected:** Meja 1 jadi kosong
6. **Expected:** Koordinator bisa assign siswa baru ke Meja 1

### Test 6: Admin Checklist

1. Login sebagai `checklist` / `checklist123`
2. **Expected:** Lihat "Selesai Test - Tunggu 1" dan "Tunggu 2"
3. **Expected:** TIDAK lihat Pool Test atau Meja 1-5
4. Klik "✓ Checklist Selesai" pada siswa
5. **Expected:** Siswa sudah di-checklist (bisa ditandai atau dipindah)

### Test 7: Assign ke Meja Penuh

1. Login sebagai Koordinator Lapangan
2. Meja 1 sudah terisi (1 siswa)
3. Klik button "M1" untuk siswa Antrian 1
4. **Expected:** Error "Meja 1 sudah terisi!"
5. **Expected:** Siswa tetap di Pool Test

---

## 💡 Tips untuk Setiap Role

### ✅ Koordinator Lapangan:

**DO:**
- Jemput siswa Antrian 1 segera
- Assign ke meja yang kosong
- Monitor capacity badge (hijau/amber/merah)
- Koordinasi dengan penguji jika ada masalah

**DON'T:**
- Jangan skip antrian (sistem enforce FIFO)
- Jangan assign ke meja yang sudah terisi
- Jangan lupa monitor Pool Test

---

### ✅ Penguji:

**DO:**
- Fokus test siswa yang sudah di-assign
- Klik "✓ Selesai Test" setelah test selesai
- Tunggu Koordinator antar siswa berikutnya

**DON'T:**
- Jangan monitor Pool Test (bukan tugas Anda)
- Jangan claim siswa sendiri (Koordinator yang handle)
- Jangan multitasking - fokus test saja

---

### ✅ Admin Checklist:

**DO:**
- Verifikasi kelengkapan dokumen siswa
- Checklist siswa yang sudah selesai
- Izinkan siswa pulang setelah checklist

**DON'T:**
- Jangan monitor Pool Test atau Meja (bukan tugas Anda)
- Jangan assign siswa (Koordinator yang handle)
- Fokus checklist saja

---

## 🔄 Auto-Move Tetap Aktif

**Penting:** Auto-move dari Tunggu 1/2 ke Pool Test **tetap aktif**!

```
TUNGGU 1/2
    ↓ Auto-move 10 detik (OTOMATIS)
POOL TEST
    ↓ Koordinator Lapangan jemput (MANUAL)
MEJA 1-5
    ↓ Penguji test & selesai (MANUAL)
SELESAI TEST
    ↓ Admin Checklist verifikasi (MANUAL)
SISWA PULANG
```

**Keuntungan:**
- Siswa terus mengalir ke Pool Test otomatis
- Koordinator tidak perlu monitor Tunggu 1/2
- Koordinator fokus jemput dari Pool Test saja
- Penguji fokus test saja
- Admin Checklist fokus verifikasi saja

---

## 📝 Summary Perubahan

### File yang Perlu Diubah:

1. **public/app.js**
   - ✅ Update `statusLabels`: "Antri Test" untuk Pool Test
   - ✅ Update `getRoleLabel`: Tambah KOORDINATOR_LAPANGAN & ADMIN_CHECKLIST
   - ✅ Update `applyRolePermissions`: Logic untuk 3 role baru
   - ✅ Update claim buttons: 5 button M1-M5 untuk Koordinator Lapangan
   - ✅ Pengingat visual "🔔 JEMPUT SISWA INI!"
   - ✅ Penguji TIDAK lihat Pool Test
   - ✅ Admin Checklist hanya lihat Selesai Test

2. **public/index.html**
   - ✅ Update Pool Test subtitle: "Antri Test - Menunggu dijemput"

3. **public/login.html**
   - ✅ Update akun `koordinator` → KOORDINATOR_LAPANGAN
   - ✅ Tambah akun `checklist` / `checklist123` → ADMIN_CHECKLIST
   - ✅ Update demo accounts info

4. **public/admin.html**
   - ✅ Update option KOORDINATOR_TEST → KOORDINATOR_LAPANGAN
   - ✅ Tambah option ADMIN_CHECKLIST di role dropdown

5. **public/admin.js**
   - ✅ Update KOORDINATOR_TEST → KOORDINATOR_LAPANGAN
   - ✅ Tambah ADMIN_CHECKLIST di default users
   - ✅ Update `getRoleAccess`: 
     - KOORDINATOR_LAPANGAN: "Pool Test, Semua Meja"
     - ADMIN_CHECKLIST: "Selesai Test (T1/T2)"
   - ✅ Update `getRoleBadge`: Badge untuk Koordinator & Admin Checklist

---

## 🎉 Kesimpulan

**Sistem 3 Role Terpisah berhasil dirancang!**

### Yang Perlu Diimplementasikan:

#### 1️⃣ Koordinator Lapangan:
- ✅ Login: `koordinator` / `koordinator123`
- ✅ Akses: Pool Test + Semua Meja
- ✅ Tugas: Jemput dari Pool → Antar ke Meja
- ✅ UI: Badge "🔔 JEMPUT SISWA INI!" + 5 button M1-M5

#### 2️⃣ Penguji:
- ✅ Login: `penguji1-5` / `penguji123`
- ✅ Akses: Meja sendiri saja
- ✅ Tugas: Test siswa + Klik "✓ Selesai Test"
- ✅ UI: Hanya lihat Meja sendiri, tidak lihat Pool

#### 3️⃣ Admin Checklist:
- ✅ Login: `checklist` / `checklist123`
- ✅ Akses: Selesai Test (T1/T2) saja
- ✅ Tugas: Checklist siswa selesai + Izinkan pulang
- ✅ UI: Hanya lihat Selesai Test, tidak lihat Pool/Meja

### Workflow Baru:
```
POS_RUANG → Tunggu 1/2
    ↓ (Auto 10s)
POOL TEST (Antri Test)
    ↓ (KOORDINATOR LAPANGAN: Jemput & Antar)
MEJA 1-5 (Sedang Test)
    ↓ (PENGUJI: Test & Selesai)
SELESAI TEST
    ↓ (ADMIN CHECKLIST: Verifikasi & Checklist)
SISWA PULANG
```

**Pembagian tugas jelas - setiap role fokus pada tugasnya!** 🚀

---

## 🔐 Login Credentials

| Role | Username | Password | Akses |
|------|----------|----------|-------|
| Admin | admin | admin123 | Semua akses |
| Pos Ruang | posruang | posruang123 | Daftar, Tunggu 1/2 |
| Pos Wawancara | poswawancara | poswawancara123 | Wawancara |
| **Koordinator Lapangan** | **koordinator** | **koordinator123** | **Pool Test, Semua Meja** |
| **Penguji 1-5** | **penguji1-5** | **penguji123** | **Meja sendiri saja** |
| **Admin Checklist** | **checklist** | **checklist123** | **Selesai Test (T1/T2)** |

---

**Silakan test sistem dan beritahu jika ada yang perlu disesuaikan!** 😊
