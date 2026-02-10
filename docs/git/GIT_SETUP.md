# 🔧 Setup Git Repository

Panduan untuk setup Git repository sebelum deploy ke VPS.

---

## 📋 Langkah 1: Inisialisasi Git (Jika Belum)

```bash
# Di folder project
git init
```

---

## 📋 Langkah 2: Buat Repository di GitHub/GitLab

### Opsi A: GitHub

1. Buka https://github.com
2. Klik tombol **"New repository"**
3. Isi nama repository: `antrian-test`
4. Pilih **Private** atau **Public**
5. **JANGAN** centang "Initialize with README"
6. Klik **"Create repository"**

### Opsi B: GitLab

1. Buka https://gitlab.com
2. Klik **"New project"**
3. Pilih **"Create blank project"**
4. Isi nama: `antrian-test`
5. Pilih visibility: **Private** atau **Public**
6. Klik **"Create project"**

---

## 📋 Langkah 3: Push Kode ke Repository

### Jika Repository Baru (Belum Ada Kode)

```bash
# Di folder project
git init
git add .
git commit -m "Initial commit - Sistem Antrian Test"

# Tambahkan remote (ganti dengan URL Anda)
git remote add origin https://github.com/username/antrian-test.git

# Push ke repository
git push -u origin main
```

### Jika Repository Sudah Ada

```bash
# Clone repository kosong
git clone https://github.com/username/antrian-test.git
cd antrian-test

# Copy semua file project ke folder ini
# Kemudian:
git add .
git commit -m "Initial commit - Sistem Antrian Test"
git push origin main
```

---

## 🔐 Setup SSH Key (Opsional tapi Recommended)

### Generate SSH Key

```bash
# Di komputer lokal
ssh-keygen -t ed25519 -C "your.email@example.com"

# Tekan Enter untuk default location
# Tekan Enter untuk no passphrase (atau buat passphrase)

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Tambahkan ke GitHub

1. Buka https://github.com/settings/keys
2. Klik **"New SSH key"**
3. Paste public key
4. Klik **"Add SSH key"**

### Tambahkan ke GitLab

1. Buka https://gitlab.com/-/profile/keys
2. Paste public key
3. Klik **"Add key"**

### Ganti Remote ke SSH

```bash
# Ganti HTTPS ke SSH
git remote set-url origin git@github.com:username/antrian-test.git
```

---

## 📋 Langkah 4: Verifikasi

```bash
# Cek remote
git remote -v

# Cek status
git status

# Cek commit history
git log --oneline
```

---

## 🔄 Workflow Development

### Setiap Kali Ada Perubahan

```bash
# Lihat perubahan
git status

# Add semua perubahan
git add .

# Commit dengan pesan
git commit -m "Update: deskripsi perubahan"

# Push ke repository
git push origin main
```

### Update di VPS

```bash
# SSH ke VPS
ssh root@vps-ip

# Masuk ke folder aplikasi
cd /var/www/antrian-test

# Pull perubahan terbaru
git pull origin main

# Install dependencies baru (jika ada)
npm install

# Restart aplikasi
pm2 restart antrian-test
```

---

## 🌿 Branching Strategy (Opsional)

### Development Branch

```bash
# Buat branch development
git checkout -b development

# Push branch
git push -u origin development

# Merge ke main saat siap production
git checkout main
git merge development
git push origin main
```

---

## 📝 .gitignore Sudah Dikonfigurasi

File berikut **TIDAK** akan di-commit ke Git:

```
node_modules/       # Dependencies
.netlify/           # Netlify files
data/*.db           # Database files
data/*.db-*         # Database backups
backups/            # Backup folder
.env                # Environment variables
.DS_Store           # Mac files
*.log               # Log files
```

**PENTING:** Database tidak di-commit ke Git untuk keamanan!

---

## 🔧 Troubleshooting

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin <your-git-url>
```

### Error: "failed to push"

```bash
# Pull dulu
git pull origin main --rebase

# Kemudian push
git push origin main
```

### Error: "Permission denied (publickey)"

```bash
# Pastikan SSH key sudah ditambahkan
ssh -T git@github.com

# Atau gunakan HTTPS
git remote set-url origin https://github.com/username/antrian-test.git
```

### Undo Last Commit (Belum Push)

```bash
git reset --soft HEAD~1
```

### Undo Changes (Belum Commit)

```bash
git checkout -- .
```

---

## 📚 Git Commands Cheat Sheet

```bash
# Status
git status

# Add files
git add .
git add filename.js

# Commit
git commit -m "message"

# Push
git push origin main

# Pull
git pull origin main

# Branch
git branch
git checkout -b new-branch
git checkout main

# Merge
git merge branch-name

# Log
git log --oneline
git log --graph --oneline --all

# Diff
git diff
git diff filename.js

# Stash (simpan perubahan sementara)
git stash
git stash pop
git stash list
```

---

## ✅ Checklist Setup Git

- [ ] Git terinstall di komputer lokal
- [ ] Repository dibuat di GitHub/GitLab
- [ ] Kode sudah di-push ke repository
- [ ] SSH key sudah disetup (opsional)
- [ ] `.gitignore` sudah dikonfigurasi
- [ ] Database tidak ter-commit
- [ ] URL repository sudah dicatat
- [ ] Test clone repository berhasil

---

## 🎯 Siap Deploy!

Setelah Git setup selesai, lanjut ke **QUICK_DEPLOY.md** untuk deploy ke VPS!
