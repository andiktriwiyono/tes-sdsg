# 💾 Backup Scripts

Folder ini berisi script untuk backup database.

---

## 📋 File-file

### 1. [backup-db.sh](backup-db.sh)
**Script backup database manual**

Berisi:
- Backup database ke folder `backups/`
- Timestamp pada nama file
- Cleanup backup lama (keep 7 hari terakhir)

**Cara pakai:**
```bash
# Manual backup
./scripts/backup/backup-db.sh

# Atau dari root folder
bash scripts/backup/backup-db.sh
```

---

### 2. [setup-backup-cron.sh](setup-backup-cron.sh)
**Setup auto backup dengan cron**

Berisi:
- Setup crontab untuk auto backup
- Backup setiap hari jam 2 pagi
- Log backup ke file

**Cara pakai:**
```bash
# Setup auto backup
./scripts/backup/setup-backup-cron.sh

# Atau dari root folder
bash scripts/backup/setup-backup-cron.sh
```

---

## 🚀 Quick Start

### Manual Backup
```bash
# Di VPS atau lokal
cd /var/www/antrian-test
bash scripts/backup/backup-db.sh
```

File backup akan disimpan di: `backups/antrian-YYYYMMDD-HHMMSS.db`

### Auto Backup (Cron)
```bash
# Setup cron (sekali saja)
cd /var/www/antrian-test
bash scripts/backup/setup-backup-cron.sh

# Cek crontab
crontab -l
```

Backup akan jalan otomatis setiap hari jam 2 pagi.

---

## 📁 Lokasi Backup

### Default Location
```
backups/
├── antrian-20260210-020000.db
├── antrian-20260209-020000.db
├── antrian-20260208-020000.db
└── ...
```

### Retention Policy
- Keep 7 hari terakhir
- Backup lama otomatis dihapus

---

## 🔧 Konfigurasi

### Ubah Waktu Backup
Edit crontab:
```bash
crontab -e
```

Ubah baris:
```
0 2 * * * /var/www/antrian-test/scripts/backup/backup-db.sh >> /var/www/antrian-test/backups/backup.log 2>&1
```

Format cron:
```
* * * * * command
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday=0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

Contoh:
- `0 2 * * *` - Setiap hari jam 2 pagi
- `0 */6 * * *` - Setiap 6 jam
- `0 0 * * 0` - Setiap Minggu jam 12 malam

### Ubah Retention
Edit `backup-db.sh`:
```bash
# Keep 7 hari terakhir
find "$BACKUP_DIR" -name "antrian-*.db" -mtime +7 -delete

# Ubah +7 ke angka lain:
# +30 = keep 30 hari
# +14 = keep 14 hari
```

---

## 🔄 Restore Backup

### Restore dari Backup
```bash
# Stop aplikasi
pm2 stop antrian-test

# Backup database current (just in case)
cp data/antrian.db data/antrian.db.before-restore

# Restore dari backup
cp backups/antrian-20260210-020000.db data/antrian.db

# Set permissions
chmod 644 data/antrian.db

# Start aplikasi
pm2 start antrian-test
```

### Verify Restore
```bash
# Cek database
sqlite3 data/antrian.db "SELECT COUNT(*) FROM students;"
sqlite3 data/antrian.db "SELECT COUNT(*) FROM users;"

# Test login
# Buka browser dan test
```

---

## 📊 Monitoring Backup

### Cek Backup Logs
```bash
# Lihat log backup
tail -f backups/backup.log

# Lihat 50 baris terakhir
tail -n 50 backups/backup.log
```

### Cek Backup Files
```bash
# List semua backup
ls -lh backups/

# Cek ukuran total
du -sh backups/

# Count backup files
ls backups/ | wc -l
```

### Cek Cron Status
```bash
# Lihat crontab
crontab -l

# Cek cron logs (Ubuntu/Debian)
grep CRON /var/log/syslog | tail -20

# Cek cron logs (CentOS/RHEL)
grep CRON /var/log/cron | tail -20
```

---

## 🆘 Troubleshooting

### Backup script tidak jalan
```bash
# Cek permissions
ls -la scripts/backup/backup-db.sh

# Set executable
chmod +x scripts/backup/backup-db.sh

# Test manual
bash scripts/backup/backup-db.sh
```

### Cron tidak jalan
```bash
# Cek cron service
sudo systemctl status cron

# Restart cron
sudo systemctl restart cron

# Cek crontab
crontab -l

# Cek logs
tail -f /var/log/syslog | grep CRON
```

### Backup folder penuh
```bash
# Cek disk space
df -h

# Hapus backup lama manual
cd backups
rm antrian-2026*.db

# Atau keep hanya 3 hari terakhir
find backups/ -name "antrian-*.db" -mtime +3 -delete
```

---

## 💡 Best Practices

### Backup Strategy
1. **Local backup** - Di VPS (daily)
2. **Remote backup** - Copy ke server lain (weekly)
3. **Cloud backup** - Upload ke cloud storage (monthly)

### Remote Backup
```bash
# Copy ke server lain via SCP
scp backups/antrian-*.db user@backup-server:/backups/

# Atau via rsync
rsync -avz backups/ user@backup-server:/backups/
```

### Cloud Backup (AWS S3)
```bash
# Install AWS CLI
sudo apt install awscli

# Configure AWS
aws configure

# Upload to S3
aws s3 cp backups/antrian-20260210.db s3://my-bucket/backups/
```

---

## 🔗 Link Terkait

- **Deployment:** [../../docs/deployment/](../../docs/deployment/)
- **Troubleshooting:** [../../docs/troubleshooting/](../../docs/troubleshooting/)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

**Kembali ke:** [INDEX.md](../../INDEX.md)
