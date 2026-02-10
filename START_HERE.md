# 🚀 START HERE - Panduan Deploy dengan Git

Selamat datang! Ini adalah panduan lengkap untuk deploy aplikasi **Sistem Antrian Test** ke VPS menggunakan Git.

---

## 📚 Urutan Baca Dokumentasi

Ikuti urutan ini untuk deployment yang sukses:

### 1️⃣ **GIT_SETUP.md** (MULAI DI SINI!)
Setup Git repository dan push kode ke GitHub/GitLab
- Inisialisasi Git
- Buat repository
- Push kode
- Setup SSH key (opsional)

### 2️⃣ **QUICK_DEPLOY.md**
Panduan cepat 3 langkah untuk deploy ke VPS
- Setup VPS
- Clone repository
- Setup Nginx

### 3️⃣ **DEPLOYMENT_CHECKLIST.md**
Checklist untuk memastikan semua langkah sudah dilakukan

### 4️⃣ **DEPLOYMENT_GUIDE.md**
Panduan lengkap dengan troubleshooting detail

---

## ⚡ Quick Overview

### Persiapan (Sekali Saja)

**1. Setup Git Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/antrian-test.git
git push -u origin main
```

**2. Setup VPS**
```bash
ssh root@vps-ip
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

**3. Clone & Deploy**
```bash
cd /var/www
sudo mkdir -p antrian-test
sudo chown -R $USER:$USER antrian-test
cd antrian-test
git clone https://github.com/username/antrian-test.git .
npm install
npm run setup-db
pm2 start ecosystem.config.js
pm2 save
```

**4. Setup Nginx** (lihat QUICK_DEPLOY.md)

---

## 🔄 Workflow Update

### Di Komputer Lokal
```bash
# Edit kode
git add .
git commit -m "Update feature"
git push origin main
```

### Di VPS
```bash
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test
```

---

## 📁 Struktur Dokumentasi

```
📄 START_HERE.md              ← Anda di sini!
📄 GIT_SETUP.md                ← Setup Git repository
📄 QUICK_DEPLOY.md             ← Panduan cepat deploy
📄 DEPLOYMENT_GUIDE.md         ← Panduan lengkap
📄 DEPLOYMENT_CHECKLIST.md     ← Checklist deployment
📄 README_DEPLOY.md            ← Ringkasan deployment
📄 DEPLOY_SUMMARY.md           ← Summary semua file

📄 ecosystem.config.js         ← Konfigurasi PM2
📄 backup-db.sh                ← Script backup database
📄 setup-backup-cron.sh        ← Setup backup otomatis
```

---

## 🎯 Informasi Aplikasi

**Domain:** tes.sdsunangiri.sch.id

**Login Default:**
- Username: `admin`
- Password: `admin123`

**Port:** 3000 (internal), 80/443 (public via Nginx)

**Database:** SQLite (data/antrian.db)

---

## ✅ Checklist Cepat

- [ ] Git repository sudah dibuat
- [ ] Kode sudah di-push ke Git
- [ ] VPS sudah siap (Node.js, PM2, Nginx, Git)
- [ ] Domain sudah pointing ke IP VPS
- [ ] Repository di-clone ke VPS
- [ ] Aplikasi running dengan PM2
- [ ] Nginx dikonfigurasi
- [ ] SSL disetup (opsional)
- [ ] Test akses via browser berhasil

---

## 🔐 Keamanan Penting

Setelah deploy, SEGERA lakukan:

1. ✅ **Ganti password admin** di halaman admin panel
2. ✅ **Setup SSL/HTTPS** dengan Let's Encrypt
3. ✅ **Konfigurasi firewall** VPS (port 22, 80, 443)
4. ✅ **Setup backup otomatis** database
5. ✅ **Monitor logs** secara berkala

---

## 📞 Butuh Bantuan?

### Cek Logs
```bash
# Aplikasi logs
pm2 logs antrian-test

# Nginx logs
sudo tail -f /var/log/nginx/antrian-test-error.log

# System logs
sudo journalctl -xe
```

### Common Issues

**Aplikasi tidak bisa diakses:**
- Cek PM2 status: `pm2 status`
- Cek Nginx status: `sudo systemctl status nginx`
- Cek logs: `pm2 logs antrian-test`

**Git pull error:**
- Cek status: `git status`
- Reset jika perlu: `git reset --hard origin/main`

**Database error:**
- Cek permissions: `ls -la data/`
- Fix: `chmod 755 data && chmod 644 data/antrian.db`

---

## 🎉 Siap Mulai!

1. Baca **GIT_SETUP.md** untuk setup Git
2. Ikuti **QUICK_DEPLOY.md** untuk deploy
3. Gunakan **DEPLOYMENT_CHECKLIST.md** untuk tracking

**Good luck dengan deployment Anda!** 🚀

---

## 📊 Fitur Aplikasi

✅ Sistem antrian test siswa
✅ Multi-role user (Admin, Pos Ruang, Koordinator, Penguji, Petugas Antar)
✅ Drag & drop siswa antar ruangan
✅ Filter berdasarkan sesi (1, 2, 3)
✅ Timer test otomatis
✅ Queue management dengan prioritas
✅ Pool capacity control (max 5 siswa)
✅ Auto-move dengan delay 10 detik
✅ Real-time updates
✅ Mobile responsive
✅ Database SQLite (ringan & cepat)

---

**Dibuat dengan ❤️ untuk SD Sunangiri**
