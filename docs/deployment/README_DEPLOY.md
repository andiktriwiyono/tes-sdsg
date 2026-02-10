# 🚀 Deploy ke VPS - Panduan Singkat

## 📦 Deployment menggunakan Git

Aplikasi ini di-deploy ke VPS menggunakan **Git** untuk version control dan update yang mudah.

---

## ⚡ Quick Start (3 Langkah)

### 1️⃣ Persiapan VPS (Sekali saja)
```bash
ssh root@your-vps-ip

# Install Node.js, PM2, Nginx, Git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 2️⃣ Clone Repository & Setup
```bash
# Clone dari Git
cd /var/www
sudo mkdir -p antrian-test
sudo chown -R $USER:$USER antrian-test
cd antrian-test

git clone https://github.com/username/antrian-test.git .
# Ganti dengan URL repository Anda!

# Install & Setup
npm install
npm run setup-db
chmod 755 data
chmod 644 data/antrian.db

# Start dengan PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 3️⃣ Setup Nginx
```bash
# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/antrian-test
```

Copy paste ini:
```nginx
server {
    listen 80;
    server_name tes.sdsunangiri.sch.id;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan:
```bash
sudo ln -s /etc/nginx/sites-available/antrian-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ✅ Selesai!

Akses: **http://tes.sdsunangiri.sch.id**

Login:
- Username: `admin`
- Password: `admin123`

---

## 🔄 Update Aplikasi (Git Workflow)

### Di Komputer Lokal (Development)
```bash
# Buat perubahan kode
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

## 📚 Dokumentasi Lengkap

- **QUICK_DEPLOY.md** - Panduan ringkas dengan Git
- **DEPLOYMENT_GUIDE.md** - Panduan detail + troubleshooting

---

## 🔧 Perintah Penting

```bash
# Update dari Git
cd /var/www/antrian-test
git pull origin main
pm2 restart antrian-test

# Cek status
pm2 status
pm2 logs antrian-test

# Backup database
cp data/antrian.db data/antrian.db.backup-$(date +%Y%m%d)
```

---

## 📝 Catatan Penting

1. **Repository Git** harus sudah dibuat (GitHub/GitLab/Bitbucket)
2. **Domain** sudah pointing ke IP VPS
3. **Database tidak di-commit** ke Git (sudah di-ignore)
4. **Backup database** secara berkala
5. **Setup SSL** untuk keamanan

---

## 🆘 Butuh Bantuan?

Cek logs di VPS:
```bash
pm2 logs antrian-test
```

Baca troubleshooting di **DEPLOYMENT_GUIDE.md**
