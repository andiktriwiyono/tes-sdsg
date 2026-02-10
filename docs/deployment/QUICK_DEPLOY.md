# ⚡ Quick Deploy Guide

## 🎯 Ringkasan Cepat

Deploy aplikasi antrian test ke VPS dengan domain **tes.sdsunangiri.sch.id** menggunakan **Git**

---

## 📋 Persiapan VPS (Sekali Setup)

```bash
# 1. Login ke VPS
ssh root@your-vps-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Install Nginx
sudo apt install -y nginx

# 5. Install Git
sudo apt install -y git
```

---

## 🚀 Deploy Aplikasi dengan Git

### 1. Clone Repository

```bash
# Buat folder aplikasi
cd /var/www
sudo mkdir -p antrian-test
sudo chown -R $USER:$USER antrian-test
cd antrian-test

# Clone dari Git
git clone https://github.com/username/antrian-test.git .
# Ganti URL dengan repository Anda!
```

### 2. Setup Aplikasi

```bash
cd /var/www/antrian-test

# Install dependencies
npm install

# ⚠️ PENTING: Setup database (WAJIB!)
# Tanpa ini, login tidak akan bisa!
npm run migrate-vps

# Set permissions
chmod 755 data
chmod 644 data/antrian.db
```

**CATATAN:** Jika skip `migrate-vps`, semua login tidak akan bisa!

### 3. Jalankan dengan PM2

```bash
# Start aplikasi
pm2 start ecosystem.config.js

# Setup auto-start
pm2 startup
pm2 save

# Cek status
pm2 status
```

---

## 🌐 Setup Nginx

```bash
# Buat file konfigurasi
sudo nano /etc/nginx/sites-available/antrian-test
```

**Paste ini:**
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

**Aktifkan:**
```bash
sudo ln -s /etc/nginx/sites-available/antrian-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Setup SSL (Opsional tapi Recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tes.sdsunangiri.sch.id
```

---

## ✅ Verifikasi

1. Buka browser: `http://tes.sdsunangiri.sch.id`
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`

---

## 🔄 Update Aplikasi (Git Pull)

Setiap kali ada perubahan kode:

```bash
cd /var/www/antrian-test

# Pull perubahan terbaru
git pull origin main

# Install dependencies baru (jika ada)
npm install

# Restart aplikasi
pm2 restart antrian-test
```

---

## 🔧 Perintah Penting

```bash
# Cek status
pm2 status

# Lihat logs
pm2 logs antrian-test

# Restart
pm2 restart antrian-test

# Stop
pm2 stop antrian-test

# Update dari Git
cd /var/www/antrian-test
git pull
pm2 restart antrian-test
```

---

## 📞 Troubleshooting

**❌ Login tidak bisa:**
```bash
cd /var/www/antrian-test
npm run migrate-vps
chmod 755 data && chmod 644 data/antrian.db
pm2 restart antrian-test
```
📖 Lihat: `VPS_LOGIN_FIX.md`

**Aplikasi tidak jalan:**
```bash
pm2 logs antrian-test
```

**Nginx error:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Port sudah dipakai:**
```bash
sudo netstat -tulpn | grep :3000
```

**Git pull error:**
```bash
git status
git pull origin main
```

---

## 📝 Catatan Penting

1. **Pastikan domain sudah pointing** ke IP VPS Anda
2. **Ganti URL Git** dengan repository Anda
3. **Backup database** secara berkala: `cp data/antrian.db data/antrian.db.backup`
4. **Ganti password admin** setelah deploy pertama kali
5. **Setup SSL** untuk keamanan (HTTPS)
6. **Jangan commit database** ke Git (sudah di-ignore)

---

## 🎯 Workflow Development

```bash
# Di komputer lokal
git add .
git commit -m "Update feature"
git push origin main

# Di VPS
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test
```

---

**Butuh bantuan lengkap? Baca `DEPLOYMENT_GUIDE.md`**
