# 🎯 Panduan Commit Pertama Kali

Langkah-langkah untuk commit kode ke Git repository untuk pertama kalinya.

---

## 📋 Prasyarat

- [ ] Git sudah terinstall di komputer
- [ ] Akun GitHub atau GitLab sudah dibuat
- [ ] Repository sudah dibuat di GitHub/GitLab

---

## 🚀 Langkah 1: Cek Git Status

```bash
# Pastikan Anda di folder project
cd "C:\Users\andik\Downloads\New folder\Tunggu"

# Cek apakah Git sudah diinisialisasi
git status
```

**Jika error "not a git repository":**
```bash
git init
```

---

## 🚀 Langkah 2: Konfigurasi Git (Jika Belum)

```bash
# Set nama Anda
git config --global user.name "Nama Anda"

# Set email Anda
git config --global user.email "email@example.com"

# Verifikasi
git config --list
```

---

## 🚀 Langkah 3: Add & Commit Files

```bash
# Lihat file yang akan di-commit
git status

# Add semua file
git add .

# Commit dengan pesan
git commit -m "Initial commit - Sistem Antrian Test SD Sunangiri"
```

---

## 🚀 Langkah 4: Buat Repository di GitHub

### Via Website:

1. Buka https://github.com
2. Login ke akun Anda
3. Klik tombol **"+"** di kanan atas → **"New repository"**
4. Isi form:
   - **Repository name:** `antrian-test-sdsunangiri`
   - **Description:** `Sistem Antrian Test untuk SD Sunangiri`
   - **Visibility:** Pilih **Private** (recommended) atau **Public**
   - **JANGAN** centang "Initialize this repository with a README"
5. Klik **"Create repository"**

### Atau via GitLab:

1. Buka https://gitlab.com
2. Login ke akun Anda
3. Klik **"New project"** → **"Create blank project"**
4. Isi form:
   - **Project name:** `antrian-test-sdsunangiri`
   - **Visibility:** Pilih **Private** atau **Public**
5. Klik **"Create project"**

---

## 🚀 Langkah 5: Connect ke Remote Repository

Setelah repository dibuat, Anda akan melihat URL repository. Copy URL tersebut.

**Contoh URL:**
- GitHub HTTPS: `https://github.com/username/antrian-test-sdsunangiri.git`
- GitHub SSH: `git@github.com:username/antrian-test-sdsunangiri.git`
- GitLab HTTPS: `https://gitlab.com/username/antrian-test-sdsunangiri.git`

```bash
# Tambahkan remote (ganti dengan URL Anda)
git remote add origin https://github.com/username/antrian-test-sdsunangiri.git

# Verifikasi remote
git remote -v
```

---

## 🚀 Langkah 6: Push ke Repository

```bash
# Push ke branch main
git push -u origin main

# Atau jika branch Anda bernama master:
git push -u origin master
```

**Jika diminta username & password:**
- Username: username GitHub/GitLab Anda
- Password: **Personal Access Token** (bukan password akun!)

### Cara Buat Personal Access Token:

**GitHub:**
1. Buka https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Beri nama: `VPS Deployment`
4. Centang scope: **repo** (full control)
5. Klik **"Generate token"**
6. **COPY TOKEN** (tidak akan ditampilkan lagi!)
7. Gunakan token ini sebagai password saat git push

**GitLab:**
1. Buka https://gitlab.com/-/profile/personal_access_tokens
2. Beri nama: `VPS Deployment`
3. Pilih scope: **read_repository**, **write_repository**
4. Klik **"Create personal access token"**
5. **COPY TOKEN**

---

## 🚀 Langkah 7: Verifikasi

```bash
# Cek remote
git remote -v

# Cek branch
git branch

# Cek commit history
git log --oneline

# Lihat di browser
# Buka URL repository Anda di GitHub/GitLab
```

---

## ✅ Selesai!

Kode Anda sudah tersimpan di Git repository! 🎉

### Langkah Selanjutnya:

1. ✅ Kode sudah di Git
2. 📖 Baca **QUICK_DEPLOY.md** untuk deploy ke VPS
3. 🚀 Clone repository di VPS
4. 🌐 Setup Nginx
5. 🔒 Setup SSL

---

## 🔄 Update Kode di Masa Depan

Setiap kali ada perubahan:

```bash
# Lihat perubahan
git status

# Add perubahan
git add .

# Commit
git commit -m "Deskripsi perubahan"

# Push
git push origin main
```

---

## 🐛 Troubleshooting

### Error: "failed to push some refs"

```bash
# Pull dulu
git pull origin main --rebase

# Kemudian push lagi
git push origin main
```

### Error: "remote origin already exists"

```bash
# Hapus remote lama
git remote remove origin

# Tambah remote baru
git remote add origin <your-git-url>
```

### Error: "Support for password authentication was removed"

Anda harus menggunakan **Personal Access Token** sebagai password, bukan password akun GitHub/GitLab.

### Lupa Token?

Buat token baru di:
- GitHub: https://github.com/settings/tokens
- GitLab: https://gitlab.com/-/profile/personal_access_tokens

---

## 📝 Catatan Penting

1. **Database tidak di-commit** (sudah di-ignore via `.gitignore`)
2. **Simpan token** di tempat aman
3. **Jangan share token** ke orang lain
4. **Backup database** secara terpisah (tidak di Git)

---

## 🎯 Checklist

- [ ] Git terinstall
- [ ] Git dikonfigurasi (name & email)
- [ ] Repository dibuat di GitHub/GitLab
- [ ] Kode di-commit
- [ ] Remote ditambahkan
- [ ] Kode di-push ke repository
- [ ] Verifikasi di browser berhasil
- [ ] Token disimpan dengan aman

---

**Siap deploy? Lanjut ke QUICK_DEPLOY.md!** 🚀
