# 🔀 Git & Version Control

Folder ini berisi panduan penggunaan Git untuk project ini.

---

## 📋 File-file

### 1. [GIT_SETUP.md](GIT_SETUP.md)
**Setup Git repository lengkap**

Berisi:
- Cara membuat repository Git (GitHub/GitLab/Bitbucket)
- Setup Git di komputer lokal
- Konfigurasi .gitignore
- Push kode pertama kali
- Setup SSH key (opsional)

**Gunakan untuk:** Setup Git dari awal

---

### 2. [GIT_WORKFLOW_GUIDE.md](GIT_WORKFLOW_GUIDE.md)
**Workflow Git yang direkomendasikan**

Berisi:
- Daily workflow (add, commit, push)
- Branching strategy
- Merge & conflict resolution
- Best practices
- Git commands reference

**Gunakan untuk:** Workflow development sehari-hari

---

### 3. [FIRST_COMMIT.md](FIRST_COMMIT.md)
**Panduan commit pertama**

Berisi:
- Cara commit kode pertama kali
- Setup remote repository
- Push ke Git
- Verifikasi

**Gunakan untuk:** Commit pertama kali ke Git

---

## 🚀 Quick Start Git

### Setup Pertama Kali
```bash
# Inisialisasi Git
git init

# Tambah remote
git remote add origin https://github.com/username/antrian-test.git

# Commit pertama
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Daily Workflow
```bash
# Setelah edit kode
git add .
git commit -m "Update feature X"
git push origin main
```

### Update di VPS
```bash
# Di VPS
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test
```

---

## 📝 Git Best Practices

### Commit Messages
✅ **Good:**
- `Add login validation`
- `Fix database migration bug`
- `Update deployment guide`

❌ **Bad:**
- `update`
- `fix bug`
- `changes`

### Apa yang Harus Di-commit
✅ **Commit:**
- Source code (`.js`, `.html`, `.css`)
- Configuration files (`package.json`, `ecosystem.config.js`)
- Documentation (`.md` files)
- Scripts (`scripts/` folder)

❌ **Jangan Commit:**
- Database (`data/antrian.db`)
- Dependencies (`node_modules/`)
- Environment files (`.env`)
- Logs (`*.log`)
- Backup files (`*.backup`)

### Branching Strategy

**Main Branch:**
- `main` atau `master` - Production code

**Feature Branches (Opsional):**
- `feature/nama-fitur` - Development fitur baru
- `bugfix/nama-bug` - Fix bug
- `hotfix/nama-fix` - Fix urgent di production

---

## 🔧 Git Commands Reference

### Basic Commands
```bash
# Status
git status

# Add files
git add .
git add file.js

# Commit
git commit -m "Message"

# Push
git push origin main

# Pull
git pull origin main
```

### Undo Changes
```bash
# Undo unstaged changes
git checkout -- file.js

# Undo staged changes
git reset HEAD file.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Branching
```bash
# Create branch
git branch feature-name

# Switch branch
git checkout feature-name

# Create and switch
git checkout -b feature-name

# Merge branch
git checkout main
git merge feature-name

# Delete branch
git branch -d feature-name
```

### Remote
```bash
# View remotes
git remote -v

# Add remote
git remote add origin <url>

# Change remote URL
git remote set-url origin <new-url>
```

---

## 🆘 Troubleshooting Git

### Conflict saat pull
```bash
# Lihat conflict
git status

# Edit file yang conflict
# Cari marker: <<<<<<< HEAD

# Setelah resolve
git add .
git commit -m "Resolve conflict"
git push
```

### Reset ke remote (HATI-HATI!)
```bash
git fetch origin
git reset --hard origin/main
```

### Stash changes
```bash
# Save changes temporarily
git stash

# Pull updates
git pull

# Restore changes
git stash pop
```

---

## 🔗 Link Terkait

- **Deployment:** [../deployment/](../deployment/)
- **Troubleshooting:** [../troubleshooting/](../troubleshooting/)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitLab Documentation](https://docs.gitlab.com/)

---

**Kembali ke:** [INDEX.md](../../INDEX.md)
