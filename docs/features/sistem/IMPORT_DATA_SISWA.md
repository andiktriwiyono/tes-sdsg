# 📥 Import Data Siswa

Fitur untuk import data siswa secara massal menggunakan file Excel atau CSV.

---

## ✨ Fitur

- ✅ Support Excel (.xlsx, .xls) dan CSV
- ✅ Download template Excel
- ✅ Auto-validasi data
- ✅ Auto-assign sesi berdasarkan nomor pendaftaran
- ✅ Error handling & reporting
- ✅ Progress indicator

---

## 🚀 Cara Menggunakan

### 1. Download Template

1. Login sebagai **admin**
2. Buka **Admin Panel**
3. Scroll ke **System Tools**
4. Klik **"📄 Download Template Excel"**
5. File `Template_Import_Siswa.xlsx` akan terdownload

### 2. Isi Data di Template

Template memiliki kolom:

| Kolom | Wajib | Format | Contoh |
|-------|-------|--------|--------|
| No Pendaftaran | ✅ Ya | Angka atau teks | 1, 2, 3, ... |
| Nama Murid | ✅ Ya | Teks | Ahmad Fauzi |
| Nama Orang Tua | ✅ Ya | Teks | Bapak Ahmad |
| Jenis Kelamin | ❌ Tidak | L atau P | L (Laki-laki), P (Perempuan) |
| Sesi | ❌ Tidak | 1, 2, atau 3 | 1 |

**Catatan:**
- Jika **Sesi** tidak diisi, akan otomatis di-assign berdasarkan No Pendaftaran:
  - No 1-35 → Sesi 1
  - No 36-71 → Sesi 2
  - No 72-106 → Sesi 3

### 3. Upload File

1. Klik tombol **"📥 Import Data"**
2. Pilih file Excel/CSV yang sudah diisi
3. Tunggu proses validasi
4. Jika ada error, akan ditampilkan
5. Konfirmasi import
6. Tunggu proses selesai

---

## 📋 Format File

### Excel (.xlsx, .xls)

```
| No Pendaftaran | Nama Murid      | Nama Orang Tua  | Jenis Kelamin | Sesi |
|----------------|-----------------|-----------------|---------------|------|
| 1              | Ahmad Fauzi     | Bapak Ahmad     | L             | 1    |
| 2              | Siti Aminah     | Ibu Siti        | P             | 1    |
| 3              | Budi Santoso    | Bapak Budi      | L             | 1    |
```

### CSV

```csv
No Pendaftaran,Nama Murid,Nama Orang Tua,Jenis Kelamin,Sesi
1,Ahmad Fauzi,Bapak Ahmad,L,1
2,Siti Aminah,Ibu Siti,P,1
3,Budi Santoso,Bapak Budi,L,1
```

---

## ✅ Validasi Data

Sistem akan memvalidasi:

1. **No Pendaftaran** - Wajib diisi
2. **Nama Murid** - Wajib diisi
3. **Nama Orang Tua** - Wajib diisi
4. **Jenis Kelamin** - Harus L atau P (jika diisi)
5. **Sesi** - Harus 1, 2, atau 3 (jika diisi)

**Jika ada error:**
- Sistem akan menampilkan daftar error
- Anda bisa memilih untuk lanjut import data yang valid
- Atau cancel dan perbaiki file

---

## 📊 Hasil Import

Setelah import selesai, sistem akan menampilkan:

```
✅ Import selesai!

Berhasil: 100 siswa
Gagal: 2 siswa

Gagal import:
- Siswa A (data tidak lengkap)
- Siswa B (jenis kelamin tidak valid)
```

---

## 🔧 Troubleshooting

### Error: "File tidak valid"

**Penyebab:** Format file tidak didukung

**Solusi:**
- Gunakan file Excel (.xlsx, .xls) atau CSV (.csv)
- Download template dan gunakan format yang sama

### Error: "File kosong atau format tidak sesuai"

**Penyebab:** File tidak memiliki data atau header tidak sesuai

**Solusi:**
- Pastikan file memiliki header kolom
- Gunakan nama kolom sesuai template:
  - "No Pendaftaran" atau "no_pendaftaran"
  - "Nama Murid" atau "nama_murid"
  - "Nama Orang Tua" atau "nama_orang_tua"
  - "Jenis Kelamin" atau "jenis_kelamin"
  - "Sesi" atau "sesi"

### Error: "Data tidak lengkap"

**Penyebab:** Ada baris yang tidak memiliki No Pendaftaran, Nama Murid, atau Nama Orang Tua

**Solusi:**
- Lengkapi data yang wajib diisi
- Atau hapus baris yang tidak lengkap

### Error: "Jenis Kelamin harus L atau P"

**Penyebab:** Nilai Jenis Kelamin tidak valid

**Solusi:**
- Gunakan "L" untuk Laki-laki
- Gunakan "P" untuk Perempuan
- Atau kosongkan jika tidak ingin mengisi

### Error: "Sesi harus 1, 2, atau 3"

**Penyebab:** Nilai Sesi tidak valid

**Solusi:**
- Gunakan angka 1, 2, atau 3
- Atau kosongkan (akan auto-assign)

---

## 💡 Tips

### 1. Gunakan Template

Selalu gunakan template yang disediakan untuk menghindari error format.

### 2. Cek Data Sebelum Upload

Pastikan semua data sudah benar sebelum upload untuk menghindari data duplikat atau salah.

### 3. Import Bertahap

Jika data banyak (>100 siswa), pertimbangkan untuk import bertahap:
- Sesi 1 dulu (35 siswa)
- Lalu Sesi 2 (35 siswa)
- Terakhir Sesi 3 (35 siswa)

### 4. Backup Database

Sebelum import data besar, backup database dulu:
```bash
# Di VPS
cd /var/www/antrian-test
cp data/antrian.db data/antrian.db.backup-$(date +%Y%m%d-%H%M%S)
```

### 5. Jenis Kelamin Opsional

Jika tidak punya data jenis kelamin, kosongkan saja. Tidak akan mempengaruhi sistem antrian.

---

## 🎯 Best Practices

### Persiapan Data

1. **Kumpulkan data** dari formulir pendaftaran
2. **Bersihkan data** - hapus spasi berlebih, typo, dll
3. **Urutkan** berdasarkan nomor pendaftaran
4. **Validasi** - cek data duplikat

### Format Data

1. **No Pendaftaran** - Gunakan angka berurutan (1, 2, 3, ...)
2. **Nama** - Gunakan huruf kapital di awal kata
3. **Jenis Kelamin** - Konsisten gunakan L/P
4. **Sesi** - Sesuaikan dengan pembagian sesi

### Setelah Import

1. **Verifikasi** - Cek jumlah siswa di System Info
2. **Test** - Coba pindahkan beberapa siswa
3. **Backup** - Backup database setelah import berhasil

---

## 📞 Butuh Bantuan?

Jika mengalami masalah saat import:

1. **Cek format file** - Pastikan sesuai template
2. **Cek error message** - Baca pesan error dengan teliti
3. **Cek browser console** - F12 → Console tab
4. **Hubungi admin** - Jika masih bermasalah

---

## 🔗 Link Terkait

- **Admin Panel:** [Admin Panel Guide](../../development/README.md)
- **Quick Start:** [QUICK_START.md](QUICK_START.md)
- **Troubleshooting:** [../../troubleshooting/](../../troubleshooting/)
- **Kembali ke Index:** [../../../INDEX.md](../../../INDEX.md)

---

**Terakhir diupdate:** 10 Februari 2026
