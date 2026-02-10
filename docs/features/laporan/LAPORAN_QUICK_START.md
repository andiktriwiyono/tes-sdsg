# 📊 Quick Start - Laporan Test

Panduan cepat menggunakan fitur laporan.

---

## 🚀 Akses Laporan

### Dari Halaman Utama
```
1. Login ke sistem
2. Klik tombol "Laporan" (hijau) di header
3. Halaman laporan akan terbuka
```

### Direct URL
- **Development**: `http://localhost:8888/laporan.html`
- **Production**: `https://tes.sdsunangiri.sch.id/laporan.html`

---

## 📋 Jenis Laporan (7 Laporan)

### 1. Ringkasan Statistik
- Total siswa
- Sudah test
- Belum test
- Rata-rata durasi

### 2. Laporan Per Sesi
- Sesi 1 (1-35)
- Sesi 2 (36-71)
- Sesi 3 (72-106)
- Progress bar

### 3. Laporan Per Meja
- Meja 1-5
- Nama penguji
- Jumlah siswa
- Rata-rata durasi

### 4. Laporan Durasi
- 5 tercepat
- 5 terlama

### 5. Detail Siswa
- Tabel lengkap
- Semua informasi

---

## 🔍 Menggunakan Filter

### Filter Sesi
```
Semua Sesi → Tampilkan semua
Sesi 1     → Hanya nomor 1-35
Sesi 2     → Hanya nomor 36-71
Sesi 3     → Hanya nomor 72-106
```

### Filter Gender
```
Semua      → Laki-laki + Perempuan
Laki-laki  → Hanya laki-laki
Perempuan  → Hanya perempuan
```

### Filter Status
```
Semua         → Sudah + Belum test
Sudah Test    → Hanya yang sudah
Belum Test    → Hanya yang belum
```

### Cara Pakai
```
1. Pilih filter yang diinginkan
2. Klik "Terapkan Filter"
3. Laporan akan update otomatis
```

---

## 📥 Export Excel

### Langkah
```
1. Klik tombol "Export Excel" (hijau)
2. File akan terdownload otomatis
3. Nama file: Laporan_Test_YYYY-MM-DD.xlsx
```

### Isi File Excel (3 Sheets)

**Sheet 1: Ringkasan**
- Summary statistik
- Breakdown per sesi
- Progress persentase

**Sheet 2: Detail Siswa**
- Tabel lengkap semua siswa
- Nomor, nama, sesi, gender, status, meja, durasi

**Sheet 3: Per Meja**
- Statistik per meja penguji
- Nama penguji, jumlah siswa, rata-rata durasi

---

## 🖨️ Print Laporan

### Langkah
```
1. Klik tombol "Print Laporan" (biru)
2. Dialog print akan muncul
3. Pilih printer atau "Save as PDF"
4. Klik Print
```

### Tips Print
- Gunakan orientation: **Portrait**
- Paper size: **A4**
- Enable "Background graphics"
- Tombol & filter otomatis disembunyikan

---

## 🔄 Refresh Data

### Kapan Perlu Refresh?
- Data baru ditambahkan
- Siswa baru selesai test
- Ingin data terbaru

### Cara Refresh
```
Klik tombol "Refresh" (abu-abu)
```

---

## 💡 Tips & Tricks

### Laporan Harian Lengkap
```
1. Filter: Semua Sesi, Semua Gender, Semua Status
2. Export Excel
3. Simpan untuk arsip
```

### Monitoring Sesi Tertentu
```
1. Filter: Pilih Sesi (1/2/3)
2. Lihat progress bar
3. Cek detail siswa
```

### Evaluasi Penguji
```
1. Lihat "Laporan Per Meja"
2. Bandingkan jumlah siswa
3. Bandingkan rata-rata durasi
```

### Identifikasi Anomali
```
1. Lihat "Laporan Durasi"
2. Cek 5 tercepat & 5 terlama
3. Analisis pola
```

---

## ⚡ Shortcut

| Aksi | Shortcut |
|------|----------|
| Print | `Ctrl + P` |
| Refresh | `F5` |
| Back | `Alt + ←` |

---

## 🎯 Use Cases

### Case 1: Laporan Akhir Hari
**Tujuan**: Dokumentasi lengkap hari ini

**Langkah**:
1. Akses laporan
2. Filter: Semua
3. Export Excel
4. Simpan file

**Hasil**: File Excel lengkap untuk arsip

---

### Case 2: Monitoring Progress Sesi
**Tujuan**: Cek progress sesi tertentu

**Langkah**:
1. Filter: Sesi 1 (atau 2/3)
2. Lihat progress bar
3. Cek siswa belum test

**Hasil**: Tahu berapa siswa yang belum test

---

### Case 3: Evaluasi Meja Penguji
**Tujuan**: Bandingkan produktivitas meja

**Langkah**:
1. Lihat "Laporan Per Meja"
2. Bandingkan jumlah siswa
3. Bandingkan durasi

**Hasil**: Tahu meja mana yang paling produktif

---

### Case 4: Print untuk Rapat
**Tujuan**: Cetak laporan untuk rapat

**Langkah**:
1. Filter sesuai kebutuhan
2. Klik "Print Laporan"
3. Save as PDF atau Print

**Hasil**: Laporan fisik untuk rapat

---

## 🐛 Troubleshooting Cepat

### Laporan kosong?
→ Cek filter, mungkin terlalu spesifik

### Export tidak jalan?
→ Coba browser lain (Chrome/Firefox)

### Print berantakan?
→ Set paper size ke A4, orientation Portrait

### Data tidak update?
→ Klik tombol "Refresh"

---

## 📞 Butuh Bantuan?

1. Baca dokumentasi lengkap: [LAPORAN_SYSTEM.md](LAPORAN_SYSTEM.md)
2. Cek console browser (F12)
3. Hubungi admin sistem

---

**© 2024 Sistem Antrian Test - SD Sunangiri**
