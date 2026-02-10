# ✅ Deployment Checklist

Print atau simpan checklist ini untuk memastikan deployment berjalan lancar.

---

## 📋 Pre-Deployment

- [ ] VPS sudah siap dan bisa diakses via SSH
- [ ] Domain `tes.sdsunangiri.sch.id` sudah pointing ke IP VPS
- [ ] Punya akses root atau sudo di VPS
- [ ] Koneksi internet stabil

---

## 🔧 Setup VPS (Sekali Saja)

- [ ] Login ke VPS berhasil: `ssh root@vps-ip`
- [ ] Node.js terinstall (cek: `node --version`)
- [ ] NPM terinstall (cek: `npm --version`)
- [ ] PM2 terinstall (cek: `pm2 --version`)
- [ ] Nginx terinstall (cek: `nginx -v`)
- [ ] Git terinstall (cek: `git --version`)
- [ ] Git dikonfigurasi (name & email)
- [ ] Folder `/var/www/antrian-test` sudah dibuat
- [ ] Permissions folder sudah benar

---

## 📦 Git Repository Setup

- [ ] Repository Git sudah dibuat (GitHub/GitLab/Bitbucket)
- [ ] Kode sudah di-push ke repository
- [ ] URL repository sudah dicatat
- [ ] Access ke repository sudah dikonfigurasi (SSH key atau HTTPS)

---

## 📤 Clone & Deploy Aplikasi

- [ ] Repository berhasil di-clone ke VPS
- [ ] Folder `public` ada
- [ ] Folder `netlify/functions` ada
- [ ] Folder `scripts` ada
- [ ] File `server-local.js` ada
- [ ] File `package.json` ada
- [ ] File `ecosystem.config.js` ada
- [ ] File `.gitignore` ada (database tidak ter-commit)

---

## 📦 Setup Aplikasi

- [ ] `npm install` berhasil dijalankan
- [ ] Folder `data` sudah dibuat
- [ ] **Database sudah dimigrasi dengan `npm run migrate-vps`** ⚠️ PENTING!
- [ ] Database `antrian.db` sudah ada di folder `data`
- [ ] Permissions database sudah benar (755 untuk folder, 644 untuk file)
- [ ] Test login admin/admin123 berhasil

---

## 🚀 PM2 Setup

- [ ] PM2 berhasil start aplikasi
- [ ] `pm2 status` menunjukkan status "online"
- [ ] `pm2 logs` tidak ada error
- [ ] `pm2 save` sudah dijalankan
- [ ] `pm2 startup` sudah dikonfigurasi (auto-start saat reboot)
- [ ] Test restart: `pm2 restart antrian-test` berhasil

---

## 🌐 Nginx Configuration

- [ ] File konfigurasi dibuat: `/etc/nginx/sites-available/antrian-test`
- [ ] Symbolic link dibuat: `/etc/nginx/sites-enabled/antrian-test`
- [ ] `sudo nginx -t` tidak ada error
- [ ] Nginx berhasil restart: `sudo systemctl restart nginx`
- [ ] Nginx status "active": `sudo systemctl status nginx`

---

## 🔒 SSL Setup (Opsional tapi Recommended)

- [ ] Certbot terinstall
- [ ] SSL certificate berhasil didapat untuk domain
- [ ] HTTPS redirect sudah aktif
- [ ] Test akses via HTTPS berhasil
- [ ] Auto-renewal sudah dikonfigurasi

---

## ✅ Testing & Verification

- [ ] Akses `http://tes.sdsunangiri.sch.id` berhasil
- [ ] Halaman login muncul
- [ ] Login dengan admin/admin123 berhasil
- [ ] Dashboard muncul dengan benar
- [ ] Test tambah siswa berhasil
- [ ] Test drag & drop siswa berhasil
- [ ] Test filter sesi berhasil
- [ ] Test semua role user berhasil
- [ ] Halaman admin panel bisa diakses
- [ ] Database menyimpan data dengan benar

---

## 🔐 Security Checklist

- [ ] Password admin default sudah diganti
- [ ] Firewall VPS sudah dikonfigurasi (port 80, 443, 22)
- [ ] SSH key authentication sudah disetup (opsional)
- [ ] Disable root login via SSH (opsional)
- [ ] SSL/HTTPS sudah aktif
- [ ] Database tidak bisa diakses dari luar

---

## 📊 Monitoring Setup

- [ ] PM2 monitoring berjalan: `pm2 monit`
- [ ] Logs bisa diakses: `pm2 logs antrian-test`
- [ ] Nginx logs bisa diakses: `/var/log/nginx/`
- [ ] Backup database sudah dijadwalkan (crontab)

---

## 📝 Documentation

- [ ] Dokumentasi deployment disimpan
- [ ] Kredensial VPS disimpan dengan aman
- [ ] IP VPS dicatat
- [ ] Domain dicatat
- [ ] Password admin baru dicatat

---

## 🎯 Post-Deployment

- [ ] Informasikan ke tim bahwa aplikasi sudah live
- [ ] Berikan akses login ke user yang membutuhkan
- [ ] Setup monitoring/alerting (opsional)
- [ ] Jadwalkan backup rutin
- [ ] Dokumentasikan prosedur update aplikasi

---

## 🔄 Maintenance Schedule

- [ ] Backup database: **Setiap hari**
- [ ] Check logs: **Setiap minggu**
- [ ] Update dependencies: **Setiap bulan**
- [ ] Security updates: **Segera saat ada**
- [ ] SSL renewal: **Otomatis (cek setiap 3 bulan)**
- [ ] Git pull updates: **Sesuai kebutuhan**

---

## 📞 Emergency Contacts

**VPS Provider:** _________________

**Domain Provider:** _________________

**Git Repository:** _________________

**Technical Support:** _________________

**Admin Contact:** _________________

---

## 🆘 Quick Commands Reference

```bash
# Update dari Git
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test

# Check status
pm2 status
sudo systemctl status nginx

# View logs
pm2 logs antrian-test
sudo tail -f /var/log/nginx/error.log

# Restart
pm2 restart antrian-test
sudo systemctl restart nginx

# Backup database
cp /var/www/antrian-test/data/antrian.db ~/backup-$(date +%Y%m%d).db

# Git status
git status
git log --oneline -5
```

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Notes:** 
_________________________________
_________________________________
_________________________________
