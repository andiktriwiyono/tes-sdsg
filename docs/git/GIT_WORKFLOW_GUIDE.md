# Panduan Lengkap Git Workflow

## Alur Kerja Normal Git

### 1. Cek Status
```bash
git status
```
Melihat file mana yang berubah, ditambah, atau dihapus.

### 2. Tambah File ke Staging
```bash
git add .                    # Tambah semua file
git add nama-file.js         # Tambah file tertentu
git add folder/              # Tambah semua file dalam folder
```

### 3. Commit Perubahan
```bash
git commit -m "Pesan commit yang jelas"
```

### 4. Push ke GitHub
```bash
git push                     # Push ke branch saat ini
git push origin main         # Push ke branch main
```

### 5. Pull dari GitHub (Ambil Update)
```bash
git pull                     # Ambil update terbaru
git pull origin main         # Ambil dari branch main
```

---

## Cara Mengatasi Kesalahan

### ❌ Kesalahan 1: Salah Commit (Belum Push)

**Batalkan commit terakhir, file kembali ke staging:**
```bash
git reset --soft HEAD~1
```

**Batalkan commit terakhir, file kembali ke working directory:**
```bash
git reset HEAD~1
```

**Batalkan commit dan buang semua perubahan (HATI-HATI!):**
```bash
git reset --hard HEAD~1
```

### ❌ Kesalahan 2: Salah Edit File (Belum Commit)

**Kembalikan 1 file ke kondisi terakhir:**
```bash
git checkout -- nama-file.js
```

**Kembalikan semua file:**
```bash
git checkout -- .
```

**Atau dengan cara baru:**
```bash
git restore nama-file.js     # Kembalikan 1 file
git restore .                # Kembalikan semua file
```

### ❌ Kesalahan 3: Sudah Push, Ingin Batalkan

**Buat commit baru yang membatalkan commit sebelumnya:**
```bash
git revert HEAD              # Batalkan commit terakhir
git revert abc1234           # Batalkan commit tertentu (pakai hash)
git push
```

### ❌ Kesalahan 4: Lupa File atau Salah Pesan Commit (Belum Push)

**Tambah file yang terlupa ke commit terakhir:**
```bash
git add file-terlupa.js
git commit --amend --no-edit
```

**Ubah pesan commit terakhir:**
```bash
git commit --amend -m "Pesan baru yang benar"
```

### ❌ Kesalahan 5: Conflict Saat Pull/Merge

**Ketika ada conflict:**
```bash
git pull
# CONFLICT muncul

# 1. Buka file yang conflict
# 2. Cari tanda <<<<<<< ======= >>>>>>>
# 3. Edit manual, pilih kode yang benar
# 4. Hapus tanda conflict
# 5. Simpan file

git add .
git commit -m "Resolve conflict"
git push
```

### ❌ Kesalahan 6: Push Ditolak (Rejected)

**Karena ada update di remote yang belum di-pull:**
```bash
git pull --rebase            # Pull dengan rebase
git push
```

**Atau:**
```bash
git pull                     # Pull biasa
# Resolve conflict jika ada
git push
```

### ❌ Kesalahan 7: Ingin Buang Semua Perubahan Lokal

**Kembalikan ke kondisi remote (HATI-HATI!):**
```bash
git fetch origin
git reset --hard origin/main
```

---

## Branch Management

### Buat Branch Baru
```bash
git branch nama-branch       # Buat branch
git checkout nama-branch     # Pindah ke branch

# Atau sekaligus:
git checkout -b nama-branch
```

### Lihat Semua Branch
```bash
git branch                   # Branch lokal
git branch -a                # Semua branch (lokal + remote)
```

### Pindah Branch
```bash
git checkout main
git checkout nama-branch
```

### Merge Branch
```bash
git checkout main            # Pindah ke branch tujuan
git merge nama-branch        # Merge dari branch lain
```

### Hapus Branch
```bash
git branch -d nama-branch    # Hapus branch lokal
git push origin --delete nama-branch  # Hapus branch remote
```

---

## Tips Penting

### 1. Cek Log Commit
```bash
git log                      # Log lengkap
git log --oneline            # Log ringkas
git log --graph --oneline    # Log dengan grafik
```

### 2. Lihat Perubahan
```bash
git diff                     # Lihat perubahan yang belum di-stage
git diff --staged            # Lihat perubahan yang sudah di-stage
git diff HEAD~1              # Bandingkan dengan commit sebelumnya
```

### 3. Stash (Simpan Sementara)
```bash
git stash                    # Simpan perubahan sementara
git stash list               # Lihat daftar stash
git stash pop                # Kembalikan stash terakhir
git stash apply              # Kembalikan tanpa hapus stash
```

### 4. Lihat Remote
```bash
git remote -v                # Lihat remote URL
git remote add origin URL    # Tambah remote
git remote set-url origin URL # Ubah remote URL
```

---

## Workflow Rekomendasi

### Untuk Kerja Sendiri:
```bash
# 1. Mulai kerja
git pull

# 2. Edit file...

# 3. Commit
git add .
git commit -m "Deskripsi perubahan"

# 4. Push
git push
```

### Untuk Kerja Tim:
```bash
# 1. Buat branch fitur
git checkout -b fitur-login

# 2. Edit file...

# 3. Commit di branch
git add .
git commit -m "Tambah fitur login"

# 4. Push branch
git push -u origin fitur-login

# 5. Buat Pull Request di GitHub

# 6. Setelah di-merge, update main
git checkout main
git pull

# 7. Hapus branch lokal
git branch -d fitur-login
```

---

## Perintah Darurat

### Batalkan Semua (Nuclear Option)
```bash
# HATI-HATI! Ini akan menghapus SEMUA perubahan lokal
git reset --hard HEAD
git clean -fd
```

### Lihat Siapa yang Edit Baris Kode
```bash
git blame nama-file.js
```

### Cari Commit yang Hilang
```bash
git reflog
```

---

## Kesalahan Umum & Solusi

| Masalah | Solusi |
|---------|--------|
| Lupa pull sebelum edit | `git stash` → `git pull` → `git stash pop` |
| Commit di branch salah | `git cherry-pick` commit ke branch yang benar |
| Push ke branch salah | `git revert` atau hubungi tim |
| File sensitif ter-commit | Gunakan `git filter-branch` atau BFG Repo-Cleaner |
| Merge conflict | Edit manual file yang conflict |

---

## Konfigurasi Berguna

```bash
# Set editor default
git config --global core.editor "code --wait"

# Set alias
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Sekarang bisa pakai:
git st    # sama dengan git status
git co    # sama dengan git checkout
```

---

## Kapan Pakai Apa?

- **git reset --soft**: Batalkan commit, file tetap di staging
- **git reset**: Batalkan commit, file kembali ke working directory
- **git reset --hard**: Batalkan commit dan buang perubahan (HATI-HATI!)
- **git revert**: Buat commit baru yang membatalkan commit lama (aman untuk yang sudah push)
- **git checkout**: Kembalikan file atau pindah branch
- **git stash**: Simpan perubahan sementara tanpa commit

---

## Contoh Kasus Nyata

### Kasus 1: Salah Edit, Belum Commit
```bash
# Kembalikan file
git checkout -- nama-file.js
```

### Kasus 2: Sudah Commit, Belum Push
```bash
# Batalkan commit
git reset HEAD~1
# Edit ulang
git add .
git commit -m "Pesan yang benar"
```

### Kasus 3: Sudah Push
```bash
# Buat commit pembatalan
git revert HEAD
git push
```

### Kasus 4: Conflict Saat Merge
```bash
git merge fitur-baru
# CONFLICT!
# Edit file yang conflict
git add .
git commit -m "Resolve conflict"
```
