# 📊 Dokumentasi Laporan

Dokumentasi lengkap untuk fitur laporan Sistem Antrian Test SD Sunangiri.

---

## 📚 Daftar Dokumentasi

### 1. Dokumentasi Lengkap
📖 **[LAPORAN_SYSTEM.md](LAPORAN_SYSTEM.md)**
- Penjelasan lengkap semua fitur
- Cara menggunakan
- Technical details
- Troubleshooting
- Use cases

### 2. Quick Start Guide
⚡ **[LAPORAN_QUICK_START.md](LAPORAN_QUICK_START.md)**
- Panduan cepat
- 7 jenis laporan
- Filter & export
- Tips & tricks

### 3. Visual Diagram
🎨 **[LAPORAN_DIAGRAM.txt](LAPORAN_DIAGRAM.txt)**
- Diagram visual sistem
- Flow diagram
- Use case scenarios
- ASCII art

---

## 🎯 Quick Links

### Untuk User
- [Cara Akses Laporan](LAPORAN_QUICK_START.md#-akses-laporan)
- [Cara Export Excel](LAPORAN_QUICK_START.md#-export-excel)
- [Cara Print Laporan](LAPORAN_QUICK_START.md#-print-laporan)
- [Tips & Tricks](LAPORAN_QUICK_START.md#-tips--tricks)

### Untuk Developer
- [Technical Details](LAPORAN_SYSTEM.md#-technical-details)
- [API Endpoints](LAPORAN_SYSTEM.md#api-endpoints)
- [Data Structure](LAPORAN_SYSTEM.md#data-structure)
- [Libraries Used](LAPORAN_SYSTEM.md#libraries-used)

### Untuk Admin
- [Use Cases](LAPORAN_SYSTEM.md#-use-cases)
- [Troubleshooting](LAPORAN_SYSTEM.md#-troubleshooting)
- [Permission & Akses](LAPORAN_SYSTEM.md#-permission--akses)

---

## 🚀 Getting Started

### 1. Akses Halaman Laporan
```
http://localhost:8888/laporan.html
```

### 2. Pilih Filter
- Sesi: Semua / 1 / 2 / 3
- Gender: Semua / Laki-laki / Perempuan
- Status: Semua / Sudah Test / Belum Test

### 3. Lihat Laporan
- Ringkasan Statistik
- Per Sesi
- Per Meja
- Durasi Test
- Detail Siswa

### 4. Export atau Print
- Export Excel: Download .xlsx
- Print Laporan: Print atau Save PDF

---

## 📊 7 Jenis Laporan

### 1. Ringkasan Statistik
Total siswa, sudah test, belum test, rata-rata durasi

### 2. Laporan Per Sesi
Sesi 1, 2, 3 dengan progress bar

### 3. Laporan Per Meja Penguji
Meja 1-5, nama penguji, jumlah siswa, rata-rata durasi

### 4. Laporan Durasi Test
5 tercepat & 5 terlama

### 5. Detail Siswa
Tabel lengkap semua siswa

### 6. Export Excel
3 sheets: Ringkasan, Detail, Per Meja

### 7. Print Laporan
Print-friendly format

---

## 🔍 Filter System

### Filter Sesi
```
Semua → Tampilkan semua sesi
Sesi 1 → Nomor 1-35
Sesi 2 → Nomor 36-71
Sesi 3 → Nomor 72-106
```

### Filter Gender
```
Semua → Laki-laki + Perempuan
Laki-laki → Hanya laki-laki
Perempuan → Hanya perempuan
```

### Filter Status
```
Semua → Sudah + Belum test
Sudah Test → Hanya yang sudah
Belum Test → Hanya yang belum
```

---

## 📥 Export Excel

### Format File
```
Laporan_Test_YYYY-MM-DD.xlsx
```

### 3 Sheets
1. **Ringkasan**: Summary & per sesi
2. **Detail Siswa**: Tabel lengkap
3. **Per Meja**: Statistik per meja

### Cara Export
```
Klik "Export Excel" → File terdownload otomatis
```

---

## 🖨️ Print Laporan

### Cara Print
```
Klik "Print Laporan" → Dialog print → Print/Save PDF
```

### Tips Print
- Paper: A4
- Orientation: Portrait
- Background graphics: Enable

---

## 💡 Use Cases

### Laporan Harian
```
Filter: Semua → Export Excel → Arsip
```

### Monitoring Sesi
```
Filter: Sesi 1 → Cek Progress → Identifikasi Belum Test
```

### Evaluasi Penguji
```
Lihat Per Meja → Bandingkan → Evaluasi
```

### Print untuk Rapat
```
Filter → Print → Save PDF → Rapat
```

---

## 🐛 Troubleshooting

### Laporan tidak muncul
```
1. Refresh halaman (F5)
2. Cek koneksi internet
3. Cek console browser (F12)
```

### Export tidak jalan
```
1. Coba browser lain
2. Cek popup blocker
3. Pastikan browser support download
```

### Print berantakan
```
1. Set paper size: A4
2. Set orientation: Portrait
3. Enable background graphics
```

---

## 📞 Support

### Dokumentasi
- [LAPORAN_SYSTEM.md](LAPORAN_SYSTEM.md) - Lengkap
- [LAPORAN_QUICK_START.md](LAPORAN_QUICK_START.md) - Quick

### Kontak
- Admin Sistem
- Developer
- IT Support

---

## 🔄 Updates

### Version 1.0.0 (2024)
- ✅ Initial release
- ✅ 7 jenis laporan
- ✅ Filter system
- ✅ Export Excel
- ✅ Print laporan

### Future Updates
- [ ] Filter tanggal
- [ ] Grafik visualisasi
- [ ] Export PDF
- [ ] Email laporan

---

## 📝 Notes

### Durasi Test
- Format: `Xm Ys` (contoh: `5m 30s`)
- Dihitung dari test_start_time sampai test_end_time
- Jika tidak ada durasi, ditampilkan `-`

### Rata-rata Durasi
- Hanya menghitung siswa yang sudah selesai test
- Siswa tanpa durasi tidak dihitung
- Jika tidak ada data, ditampilkan `-`

### Filter
- Filter bersifat kumulatif (AND logic)
- Contoh: Sesi 1 + Laki-laki = hanya siswa laki-laki di sesi 1
- Reset filter dengan pilih "Semua" di semua dropdown

---

## 🎯 Quick Reference

| Fitur | Shortcut | Keterangan |
|-------|----------|------------|
| Print | `Ctrl + P` | Print laporan |
| Refresh | `F5` | Reload data |
| Back | `Alt + ←` | Kembali |
| Console | `F12` | Debug |

---

## 📚 Related Documentation

### Main System
- [README.md](../README.md) - Main documentation
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference
- [KOORDINATOR_TEST_SYSTEM.md](KOORDINATOR_TEST_SYSTEM.md) - Koordinator system

### Deployment
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Deployment guide
- [QUICK_DEPLOY.md](../QUICK_DEPLOY.md) - Quick deploy

---

**© 2024 Sistem Antrian Test - SD Sunangiri**

**Dokumentasi Version**: 1.0.0
