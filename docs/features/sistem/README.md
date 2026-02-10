# ⚙️ Dokumentasi Sistem & Workflow

Folder ini berisi dokumentasi tentang sistem dan workflow aplikasi.

---

## 📋 File-file

### 1. [KOORDINATOR_TEST_SYSTEM.md](KOORDINATOR_TEST_SYSTEM.md)
**Sistem koordinator ruang test**

Berisi:
- Role & permission koordinator
- Workflow koordinator
- Ploting siswa ke meja
- Monitoring sistem
- Best practices

**Gunakan untuk:** Memahami sistem koordinator test

---

### 2. [POOL_CAPACITY_SYSTEM.md](POOL_CAPACITY_SYSTEM.md)
**Sistem pool capacity & queue**

Berisi:
- Pool capacity control (max 5 siswa)
- FIFO queue system
- Auto-move mechanism
- Overflow handling
- Technical implementation

**Gunakan untuk:** Memahami sistem pool & queue

---

### 3. [QUICK_START.md](QUICK_START.md)
**Quick start guide aplikasi**

Berisi:
- Setup awal
- Login pertama kali
- Workflow dasar
- Tips untuk pemula

**Gunakan untuk:** Mulai menggunakan aplikasi

---

### 4. [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
**Referensi cepat**

Berisi:
- Cheat sheet fitur
- Keyboard shortcuts
- Quick commands
- Troubleshooting cepat

**Gunakan untuk:** Referensi cepat saat menggunakan aplikasi

---

## 🎯 Sistem Utama

### 1. Multi-Role System
- 9 role berbeda
- Permission-based access
- Role-specific dashboard

### 2. Auto-Move System
- Ruang Tunggu → Pool Test (10 detik)
- Countdown timer
- Auto-refresh

### 3. Pool Capacity Control
- Maksimal 5 siswa di Pool Test
- Overflow prevention
- Queue management

### 4. FIFO Queue System
- 3 antrian independen
- Strict ordering
- Fair distribution

### 5. Drag & Drop
- Desktop mode
- Touch-optimized mobile
- Smooth animations

---

## 🔄 Workflow Sistem

```
DAFTAR SISWA
    ↓ (POS_RUANG: Pindah ke Tunggu)
RUANG TUNGGU 1/2
    ↓ (AUTO-MOVE: 10 detik)
POOL TEST (Antri Test, max 5)
    ↓ (KOORDINATOR: Ploting ke Meja)
MEJA 1-5 (Sedang Test)
    ↓ (PENGUJI: Selesai Test)
    ↓ (PETUGAS ANTAR: Antar Kembali)
SELESAI TEST (T1/T2)
```

---

## 👥 Role & Permission

### Admin (👑)
- Full access semua fitur
- Manajemen user & guru
- Reset data & system tools

### Pos Ruang (📋)
- Daftar Siswa → Ruang Tunggu 1/2
- Monitor Selesai Test

### Koordinator Ruang Test (🎯)
- Monitor Ruang Tunggu 1/2
- Ploting siswa dari Pool Test ke Meja
- Monitor semua meja penguji

### Petugas Antar-Jemput (🚶)
- Antar siswa dari Pool Test ke Meja
- Jemput siswa selesai test ke Ruang Selesai

### Penguji Meja 1-5 (📝)
- Hanya akses meja sendiri
- Tandai siswa selesai test

---

## 🔗 Link Terkait

- **Laporan:** [../laporan/](../laporan/)
- **Diagram:** [../../diagrams/](../../diagrams/)
- **Development:** [../../development/](../../development/)
- **Kembali ke Features:** [../README.md](../README.md)
- **Kembali ke Index:** [../../../INDEX.md](../../../INDEX.md)

---

**Kembali ke:** [INDEX.md](../../../INDEX.md)
