# 🔧 Troubleshooting

Folder ini berisi solusi untuk masalah-masalah yang sering terjadi.

---

## 📋 File-file

### 1. [VPS_LOGIN_FIX.md](VPS_LOGIN_FIX.md)
**Fix login tidak bisa di VPS**

**Masalah:** Setelah deploy ke VPS, semua login tidak bisa masuk (401 Unauthorized)

**Penyebab:** Database belum dimigrasi di VPS

**Solusi:**
```bash
cd /var/www/antrian-test
node scripts/migrate-db-vps.js
chmod 755 data
chmod 644 data/antrian.db
pm2 restart antrian-test
```

Berisi:
- Solusi cepat (3 langkah)
- Verifikasi database
- Troubleshooting detail
- Default user credentials
- Workflow deployment yang benar

**Gunakan untuk:** Masalah login setelah deployment

---

### 2. [SOLUSI_LOGIN_VPS.txt](SOLUSI_LOGIN_VPS.txt)
**Solusi cepat dalam format teks**

Berisi:
- Solusi singkat dalam 3 langkah
- Format teks plain untuk copy-paste cepat

**Gunakan untuk:** Referensi cepat atau share via chat/email

---

## 🆘 Masalah Umum Lainnya

### Aplikasi tidak bisa diakses
```bash
# Cek status PM2
pm2 status
pm2 logs antrian-test

# Cek Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Port sudah digunakan
```bash
# Cek port
sudo netstat -tulpn | grep :3000

# Kill process
sudo kill -9 <PID>
```

### Database error
```bash
# Fix permissions
chmod 755 data
chmod 644 data/antrian.db

# Cek database
ls -la data/antrian.db
```

### Git pull error
```bash
# Lihat status
git status

# Reset ke remote (HATI-HATI!)
git fetch origin
git reset --hard origin/main

# Atau stash dulu
git stash
git pull
git stash pop
```

### Nginx tidak bisa restart
```bash
# Test konfigurasi
sudo nginx -t

# Lihat error
sudo journalctl -xe

# Restart
sudo systemctl restart nginx
```

---

## 🔗 Link Terkait

- **Deployment Guide:** [../deployment/DEPLOYMENT_GUIDE.md](../deployment/DEPLOYMENT_GUIDE.md)
- **Git Workflow:** [../git/GIT_WORKFLOW_GUIDE.md](../git/GIT_WORKFLOW_GUIDE.md)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

## 📞 Butuh Bantuan Lebih?

1. Cek logs: `pm2 logs antrian-test`
2. Cek Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Lihat deployment guide lengkap
4. Hubungi tim development

---

**Kembali ke:** [INDEX.md](../../INDEX.md)
