# 📦 Ringkasan File Deployment

Semua file untuk deployment ke VPS **tes.sdsunangiri.sch.id** menggunakan **Git**!

---

## 📄 File-file yang Sudah Dibuat

### 1. Dokumentasi
- ✅ **README_DEPLOY.md** - Panduan utama (BACA INI DULU!)
- ✅ **QUICK_DEPLOY.md** - Panduan cepat dengan Git
- ✅ **DEPLOYMENT_GUIDE.md** - Panduan lengkap + troubleshooting
- ✅ **DEPLOYMENT_CHECKLIST.md** - Checklist untuk memastikan semua langkah

### 2. Script Utility
- ✅ **backup-db.sh** - Script backup database otomatis
- ✅ **setup-backup-cron.sh** - Setup backup otomatis harian

### 3. Konfigurasi
- ✅ **ecosystem.config.js** - Konfigurasi PM2 process manager
- ✅ **.env.example** - Template environment variables
- ✅ **.gitignore** - Ignore database dan file sensitif

### 4. Aplikasi
- ✅ **server-local.js** - Server Node.js untuk production
- ✅ **package.json** - Dependencies (sudah diupdate dengan script baru)

---

## 🚀 Cara Deploy dengan Git

### Persiapan (Sekali Saja)

**1. Push ke Git Repository**
```bash
# Di komputer lokal
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/antrian-test.git
git push -u origin main
```

**2. Setup VPS**
```bash
ssh root@vps-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

**3. Clone & Deploy**
```bash
# Clone repository
cd /var/www
sudo mkdir -p antrian-test
sudo chown -R $USER:$USER antrian-test
cd antrian-test
git clone https://github.com/username/antrian-test.git .

# Setup aplikasi
npm install
npm run setup-db
chmod 755 data
chmod 644 data/antrian.db

# Start dengan PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

**4. Setup Nginx** (lihat QUICK_DEPLOY.md)

---

## 🔄 Workflow Update (Git)

### Di Komputer Lokal (Development)
```bash
# Edit kode
git add .
git commit -m "Update feature"
git push origin main
```

### Di VPS (Production)
```bash
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test
```

---

## 📋 Langkah Deployment Ringkas

### 1. Persiapan Repository Git
```bash
# Buat repository di GitHub/GitLab
# Push kode ke repository
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-url>
git push -u origin main
```

### 2. Setup VPS
```bash
ssh root@vps-ip
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 3. Clone & Deploy
```bash
cd /var/www
sudo mkdir -p antrian-test
sudo chown -R $USER:$USER antrian-test
cd antrian-test
git clone <your-git-url> .
npm install
npm run setup-db
pm2 start ecosystem.config.js
pm2 save
```

### 4. Setup Nginx
```bash
# Buat file: /etc/nginx/sites-available/antrian-test
# Copy konfigurasi dari QUICK_DEPLOY.md
sudo ln -s /etc/nginx/sites-available/antrian-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL (Opsional)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tes.sdsunangiri.sch.id
```

---

## ✅ Verifikasi

1. Buka: **http://tes.sdsunangiri.sch.id**
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Test semua fitur

---

## 🔧 Perintah Penting

```bash
# Update dari Git
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test

# Status aplikasi
pm2 status

# Lihat logs
pm2 logs antrian-test

# Backup database
cp data/antrian.db data/antrian.db.backup-$(date +%Y%m%d)
```

---

## 📊 Struktur di VPS

```
/var/www/antrian-test/
├── .git/                # Git repository
├── public/              # Frontend files
├── netlify/functions/   # API endpoints
├── scripts/             # Database scripts
├── data/                # SQLite database (not in Git)
│   └── antrian.db
├── backups/             # Database backups (not in Git)
├── server-local.js      # Node.js server
├── ecosystem.config.js  # PM2 config
└── package.json
```

---

## 🎯 Fitur Aplikasi yang Akan Live

✅ Sistem antrian test siswa
✅ Multi-role user (Admin, Pos Ruang, Koordinator, dll)
✅ Drag & drop siswa antar ruangan
✅ Filter berdasarkan sesi (1, 2, 3)
✅ Timer test otomatis
✅ Queue management
✅ Pool capacity control
✅ Real-time updates
✅ Mobile responsive

---

## 🔐 Keamanan

Setelah deploy, SEGERA:
1. ✅ Ganti password admin default
2. ✅ Setup SSL/HTTPS
3. ✅ Konfigurasi firewall VPS
4. ✅ Setup backup otomatis

---

## 📞 Troubleshooting

**Aplikasi tidak bisa diakses:**
```bash
pm2 logs antrian-test
sudo systemctl status nginx
```

**Git pull error:**
```bash
git status
git pull origin main
# Jika ada conflict:
git stash
git pull
```

**Database error:**
```bash
ls -la /var/www/antrian-test/data/
chmod 755 /var/www/antrian-test/data
chmod 644 /var/www/antrian-test/data/antrian.db
```

Lihat troubleshooting lengkap di **DEPLOYMENT_GUIDE.md**

---

## 📚 Urutan Baca Dokumentasi

1. **README_DEPLOY.md** ← Mulai dari sini
2. **QUICK_DEPLOY.md** ← Panduan cepat Git
3. **DEPLOYMENT_CHECKLIST.md** ← Checklist
4. **DEPLOYMENT_GUIDE.md** ← Jika butuh detail

---

## 🎉 Keuntungan Menggunakan Git

✅ Version control - track semua perubahan
✅ Easy rollback - kembali ke versi sebelumnya
✅ Collaboration - tim bisa kerja bareng
✅ Update mudah - tinggal `git pull`
✅ Backup otomatis - kode tersimpan di cloud

---

## 🚀 Selamat Deploy!

Semua sudah siap. Push kode ke Git, clone di VPS, dan aplikasi Anda akan live di **tes.sdsunangiri.sch.id**

**Good luck!** 🚀
