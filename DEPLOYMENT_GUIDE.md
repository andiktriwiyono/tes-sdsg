# 🚀 Panduan Deploy ke VPS (tes.sdsunangiri.sch.id)

## Prasyarat di VPS
1. **Node.js** (versi 14 atau lebih baru)
2. **PM2** (process manager)
3. **Nginx** (web server)
4. **Git** (version control)
5. **Domain** sudah pointing ke IP VPS

---

## 📋 Langkah 1: Persiapan VPS

### 1.1 Login ke VPS via SSH
```bash
ssh root@your-vps-ip
# atau
ssh username@your-vps-ip
```

### 1.2 Install Node.js (jika belum ada)
```bash
# Update package list
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

### 1.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx (jika belum ada)
```bash
sudo apt install -y nginx
```

### 1.5 Install Git (jika belum ada)
```bash
sudo apt install -y git

# Konfigurasi Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📦 Langkah 2: Clone Repository dari Git

### 2.1 Buat folder untuk aplikasi
```bash
cd /var/www
sudo mkdir -p antrian-test
sudo chown -R $USER:$USER antrian-test
cd antrian-test
```

### 2.2 Clone repository
```bash
# Jika menggunakan GitHub/GitLab
git clone https://github.com/username/antrian-test.git .

# Atau jika menggunakan SSH
git clone git@github.com:username/antrian-test.git .

# Atau jika repository private, akan diminta username & password/token
```

**CATATAN:** Ganti URL repository dengan URL Git Anda yang sebenarnya!

---

## 🔧 Langkah 3: Setup Aplikasi di VPS

```bash
# Pastikan berada di folder aplikasi
cd /var/www/antrian-test

# Install dependencies
npm install

# Setup database (jalankan semua migrations)
npm run setup-db

# Atau jalankan satu per satu:
node scripts/init-db.js
node scripts/add-users-table.js
node scripts/add-teachers-table.js
node scripts/add-escort-columns.js
node scripts/add-meja-asal-column.js
node scripts/add-sesi-column.js

# (Opsional) Seed data awal untuk testing
node scripts/seed-real-data.js

# Set permissions untuk database
chmod 755 data
chmod 644 data/antrian.db
```

---

## 🚀 Langkah 4: Jalankan Aplikasi dengan PM2

```bash
# Start aplikasi dengan PM2
pm2 start ecosystem.config.js

# Atau start manual:
pm2 start server-local.js --name antrian-test

# Lihat status
pm2 status

# Lihat logs
pm2 logs antrian-test

# Setup PM2 untuk auto-start saat reboot
pm2 startup
pm2 save
```

---

## 🌐 Langkah 5: Konfigurasi Nginx

### 5.1 Buat file konfigurasi Nginx
```bash
sudo nano /etc/nginx/sites-available/antrian-test
```

### 5.2 Paste konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name tes.sdsunangiri.sch.id;

    # Logs
    access_log /var/log/nginx/antrian-test-access.log;
    error_log /var/log/nginx/antrian-test-error.log;

    # Proxy ke aplikasi Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Timeout settings
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

### 5.3 Aktifkan konfigurasi
```bash
# Buat symbolic link
sudo ln -s /etc/nginx/sites-available/antrian-test /etc/nginx/sites-enabled/

# Test konfigurasi Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Langkah 6: Setup SSL (HTTPS) dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Dapatkan SSL certificate
sudo certbot --nginx -d tes.sdsunangiri.sch.id

# Ikuti instruksi interaktif
# Pilih opsi untuk redirect HTTP ke HTTPS

# Auto-renewal sudah disetup otomatis
# Test renewal:
sudo certbot renew --dry-run
```

---

## ✅ Langkah 7: Verifikasi Deployment

1. **Buka browser** dan akses: `http://tes.sdsunangiri.sch.id`
2. **Login** dengan kredensial default:
   - Username: `admin`
   - Password: `admin123`
3. **Test semua fitur** aplikasi

---

## 🔄 Update Aplikasi (Git Pull)

Setiap kali ada perubahan kode di repository:

```bash
# Masuk ke folder aplikasi
cd /var/www/antrian-test

# Pull perubahan terbaru dari Git
git pull origin main
# atau: git pull origin master (tergantung branch utama Anda)

# Install dependencies baru (jika ada)
npm install

# Restart aplikasi
pm2 restart antrian-test

# Lihat logs untuk memastikan tidak ada error
pm2 logs antrian-test
```

---

## 🔧 Perintah Maintenance

### Restart Aplikasi
```bash
pm2 restart antrian-test
```

### Stop Aplikasi
```bash
pm2 stop antrian-test
```

### Lihat Logs
```bash
pm2 logs antrian-test
pm2 logs antrian-test --lines 100
```

### Update Aplikasi dari Git
```bash
cd /var/www/antrian-test
git pull
npm install
pm2 restart antrian-test
```

### Backup Database
```bash
# Backup manual
cp /var/www/antrian-test/data/antrian.db /var/www/antrian-test/data/antrian.db.backup-$(date +%Y%m%d)

# Atau gunakan script backup
/var/www/antrian-test/backup-db.sh

# Setup auto backup (crontab)
crontab -e
# Tambahkan baris ini untuk backup setiap hari jam 2 pagi:
0 2 * * * /var/www/antrian-test/backup-db.sh >> /var/www/antrian-test/backups/backup.log 2>&1
```

### Monitor Resource
```bash
pm2 monit
```

---

## � Troubleshooting

### Aplikasi tidak bisa diakses
```bash
# Cek status PM2
pm2 status

# Cek logs error
pm2 logs antrian-test --err

# Cek Nginx status
sudo systemctl status nginx

# Cek Nginx error log
sudo tail -f /var/log/nginx/antrian-test-error.log
```

### Port sudah digunakan
```bash
# Cek port yang digunakan
sudo netstat -tulpn | grep :3000

# Kill process jika perlu
sudo kill -9 <PID>
```

### Database error
```bash
# Cek permissions
ls -la /var/www/antrian-test/data/

# Fix permissions
chmod 755 /var/www/antrian-test/data
chmod 644 /var/www/antrian-test/data/antrian.db
```

### Nginx tidak bisa restart
```bash
# Test konfigurasi
sudo nginx -t

# Lihat error detail
sudo journalctl -xe
```

### Git pull error (conflict)
```bash
# Lihat status
git status

# Jika ada conflict, reset ke versi remote (HATI-HATI: akan hilangkan perubahan lokal)
git fetch origin
git reset --hard origin/main

# Atau stash perubahan lokal dulu
git stash
git pull
git stash pop
```

---

## 📞 Support

Jika ada masalah, cek:
1. PM2 logs: `pm2 logs antrian-test`
2. Nginx error log: `sudo tail -f /var/log/nginx/antrian-test-error.log`
3. System log: `sudo journalctl -xe`

---

## 🎯 Checklist Deployment

- [ ] Node.js terinstall
- [ ] PM2 terinstall
- [ ] Nginx terinstall
- [ ] Git terinstall
- [ ] Repository di-clone ke `/var/www/antrian-test`
- [ ] Dependencies terinstall (`npm install`)
- [ ] Database terinisialisasi
- [ ] PM2 running aplikasi
- [ ] Nginx dikonfigurasi
- [ ] Domain pointing ke VPS
- [ ] SSL certificate terinstall (opsional tapi recommended)
- [ ] Test akses via browser
- [ ] PM2 auto-startup enabled

---

## 📝 Catatan Penting

1. **Jangan commit database** ke Git (sudah di-ignore via `.gitignore`)
2. **Backup database** secara berkala
3. **Ganti password admin** setelah deploy pertama kali
4. **Setup SSL/HTTPS** untuk keamanan
5. **Monitor logs** secara rutin

---

**Selamat! Aplikasi Anda sudah live di tes.sdsunangiri.sch.id** 🎉
