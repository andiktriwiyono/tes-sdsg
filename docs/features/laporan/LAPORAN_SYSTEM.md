# 📊 Sistem Laporan Test

Dokumentasi lengkap untuk fitur laporan pada Sistem Antrian Test SD Sunangiri.

---

## 🎯 Fitur Utama

### 1. **Laporan Real-time**
- Data diambil langsung dari database
- Auto-refresh setiap kali filter diterapkan
- Timestamp laporan otomatis

### 2. **Filter Laporan**
- **Filter Sesi**: Sesi 1, 2, 3, atau Semua
- **Filter Gender**: Laki-laki, Perempuan, atau Semua
- **Filter Status**: Sudah Test, Belum Test, atau Semua

### 3. **Export & Print**
- **Export Excel**: Download laporan dalam format .xlsx
- **Print**: Print-friendly format untuk laporan fisik
- **Refresh**: Reload data terbaru dari database

---

## 📋 Jenis Laporan

### 1. Ringkasan Statistik
Menampilkan:
- Total siswa (sesuai filter)
- Jumlah siswa sudah test
- Jumlah siswa belum test
- Rata-rata durasi test

### 2. Laporan Per Sesi
Untuk setiap sesi (1, 2, 3):
- Total siswa dalam sesi
- Jumlah sudah test
- Jumlah belum test
- Progress bar (persentase)

### 3. Laporan Per Meja Penguji
Untuk setiap meja (1-5):
- Nama penguji (2 guru per meja)
- Jumlah siswa yang di-test
- Rata-rata durasi test

### 4. Laporan Durasi Test
- **5 Tercepat**: Siswa dengan durasi test terpendek
- **5 Terlama**: Siswa dengan durasi test terpanjang
- Menampilkan nama, nomor, meja, dan durasi

### 5. Detail Siswa
Tabel lengkap berisi:
- Nomor urut
- Nomor pendaftaran
- Nama siswa
- Sesi
- Gender
- Status test
- Meja test
- Durasi test

---

## 🚀 Cara Menggunakan

### Akses Halaman Laporan

1. **Dari Halaman Utama**:
   - Klik tombol **"Laporan"** (hijau) di header
   
2. **Dari Admin Panel**:
   - Klik tombol **"Laporan"** (hijau) di header

3. **Direct URL**:
   - Akses: `http://localhost:8888/laporan.html`
   - Production: `https://tes.sdsunangiri.sch.id/laporan.html`

### Menggunakan Filter

1. Pilih filter yang diinginkan:
   - **Sesi**: Pilih sesi tertentu atau semua
   - **Gender**: Pilih gender tertentu atau semua
   - **Status**: Pilih status test atau semua

2. Klik tombol **"Terapkan Filter"**

3. Laporan akan di-update sesuai filter

### Export ke Excel

1. Klik tombol **"Export Excel"** (hijau)

2. File akan otomatis terdownload dengan nama:
   ```
   Laporan_Test_YYYY-MM-DD.xlsx
   ```

3. File Excel berisi 3 sheet:
   - **Ringkasan**: Summary statistik dan per sesi
   - **Detail Siswa**: Tabel lengkap semua siswa
   - **Per Meja**: Statistik per meja penguji

### Print Laporan

1. Klik tombol **"Print Laporan"** (biru)

2. Dialog print browser akan muncul

3. Pilih printer atau "Save as PDF"

4. Tombol dan filter akan otomatis disembunyikan saat print

### Refresh Data

1. Klik tombol **"Refresh"** (abu-abu)

2. Data akan di-reload dari database

3. Laporan akan di-update dengan data terbaru

---

## 📊 Format Excel

### Sheet 1: Ringkasan
```
LAPORAN TEST - SD SUNANGIRI
Tanggal: [Tanggal Laporan]

RINGKASAN
Total Siswa: XX
Sudah Test: XX
Belum Test: XX

BREAKDOWN PER SESI
Sesi | Total | Sudah Test | Belum Test | Progress (%)
1    | XX    | XX         | XX         | XX%
2    | XX    | XX         | XX         | XX%
3    | XX    | XX         | XX         | XX%
```

### Sheet 2: Detail Siswa
```
No | No Pendaftaran | Nama | Orang Tua | Sesi | Gender | Status | Meja | Durasi
1  | 001           | ...  | ...       | 1    | L/P    | ...    | 1    | 5m 30s
```

### Sheet 3: Per Meja
```
Meja   | Penguji          | Jumlah Siswa | Rata-rata Durasi
Meja 1 | Guru A & Guru B  | 10           | 5m 45s
```

---

## 🎨 Tampilan Print

Saat print, sistem akan:
- Menyembunyikan tombol aksi
- Menyembunyikan filter
- Menyembunyikan header navigasi
- Mengoptimalkan layout untuk kertas A4
- Menampilkan timestamp laporan

---

## 🔐 Permission & Akses

### Siapa yang Bisa Akses?

**Semua role bisa akses laporan**, termasuk:
- ✅ Admin
- ✅ Pos Ruang
- ✅ Koordinator Ruang Test
- ✅ Petugas Antar-Jemput
- ✅ Penguji Meja 1-5

### Data yang Ditampilkan

- Laporan menampilkan **semua data siswa** (tidak dibatasi per role)
- Filter dapat digunakan untuk menyaring data sesuai kebutuhan
- Export dan print tersedia untuk semua user

---

## 📈 Use Cases

### 1. Laporan Harian
**Tujuan**: Melihat progress test hari ini

**Langkah**:
1. Akses halaman laporan
2. Pilih filter "Semua Sesi", "Semua Gender", "Semua Status"
3. Lihat ringkasan statistik
4. Export Excel untuk arsip

### 2. Laporan Per Sesi
**Tujuan**: Monitoring progress sesi tertentu

**Langkah**:
1. Pilih filter "Sesi 1" (atau 2/3)
2. Lihat detail siswa dalam sesi tersebut
3. Cek progress bar untuk melihat persentase

### 3. Evaluasi Penguji
**Tujuan**: Melihat produktivitas per meja

**Langkah**:
1. Lihat section "Laporan Per Meja Penguji"
2. Bandingkan jumlah siswa per meja
3. Bandingkan rata-rata durasi per meja
4. Export untuk evaluasi

### 4. Analisis Durasi
**Tujuan**: Identifikasi siswa dengan durasi ekstrem

**Langkah**:
1. Lihat section "Laporan Durasi Test"
2. Cek 5 tercepat dan 5 terlama
3. Analisis pola atau anomali

### 5. Laporan Lengkap
**Tujuan**: Dokumentasi lengkap untuk arsip

**Langkah**:
1. Pilih filter sesuai kebutuhan
2. Klik "Export Excel"
3. Simpan file untuk arsip
4. Atau klik "Print" untuk cetak fisik

---

## 🛠️ Technical Details

### API Endpoints
```javascript
// Students data
GET /api/students
GET /.netlify/functions/students

// Teachers data
GET /api/teachers
GET /.netlify/functions/teachers
```

### Data Structure
```javascript
// Student object
{
  id: number,
  no_pendaftaran: string,
  nama_murid: string,
  nama_orang_tua: string,
  sesi: number,
  jenis_kelamin: string,
  lokasi: string,
  sudah_test: number,
  meja_asal: string,
  test_start_time: string,
  test_end_time: string
}

// Teacher object
{
  id: number,
  meja_number: number,
  position: number,
  teacher_name: string
}
```

### Libraries Used
- **XLSX.js**: Export to Excel
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`
  - Version: 0.18.5

---

## 🐛 Troubleshooting

### Laporan tidak muncul
**Solusi**:
1. Cek koneksi internet
2. Refresh halaman (F5)
3. Cek console browser untuk error
4. Pastikan sudah login

### Export Excel tidak berfungsi
**Solusi**:
1. Pastikan browser support download
2. Cek popup blocker
3. Coba browser lain (Chrome/Firefox)

### Data tidak sesuai
**Solusi**:
1. Klik tombol "Refresh"
2. Cek filter yang diterapkan
3. Pastikan data di database sudah benar

### Print layout berantakan
**Solusi**:
1. Gunakan Chrome atau Firefox
2. Set orientation ke "Portrait"
3. Set paper size ke "A4"
4. Enable "Background graphics"

---

## 📝 Notes

### Durasi Test
- Durasi dihitung dari `test_start_time` sampai `test_end_time`
- Format: `Xm Ys` (contoh: `5m 30s`)
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

## 🎯 Future Improvements

Fitur yang bisa ditambahkan:
- [ ] Filter berdasarkan tanggal
- [ ] Grafik visualisasi (chart.js)
- [ ] Export PDF
- [ ] Email laporan otomatis
- [ ] Perbandingan antar sesi
- [ ] Statistik per hari/minggu/bulan
- [ ] Dashboard analytics

---

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek dokumentasi ini
2. Cek console browser untuk error
3. Hubungi admin sistem

---

**© 2024 Sistem Antrian Test - SD Sunangiri**
