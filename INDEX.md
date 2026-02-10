# 📚 Dokumentasi Sistem Antrian Test

Selamat datang di dokumentasi Sistem Antrian Test SD Sunangiri.

---

## 🚀 Mulai Cepat

- **[START_HERE.md](START_HERE.md)** - Mulai dari sini untuk setup awal
- **[README.md](README.md)** - Informasi umum tentang aplikasi

---

## 📂 Struktur Dokumentasi

### 🚢 Deployment
Panduan untuk deploy aplikasi ke VPS/hosting.

- **[DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md)** - Panduan lengkap deployment ke VPS
- **[QUICK_DEPLOY.md](docs/deployment/QUICK_DEPLOY.md)** - Panduan deployment cepat
- **[DEPLOYMENT_CHECKLIST.md](docs/deployment/DEPLOYMENT_CHECKLIST.md)** - Checklist deployment
- **[README_DEPLOY.md](docs/deployment/README_DEPLOY.md)** - Ringkasan deployment
- **[DEPLOY_SUMMARY.md](docs/deployment/DEPLOY_SUMMARY.md)** - Summary deployment

### 🔧 Troubleshooting
Solusi untuk masalah yang sering terjadi.

- **[VPS_LOGIN_FIX.md](docs/troubleshooting/VPS_LOGIN_FIX.md)** - Fix login tidak bisa di VPS
- **[SOLUSI_LOGIN_VPS.txt](docs/troubleshooting/SOLUSI_LOGIN_VPS.txt)** - Solusi cepat login VPS

### 🔀 Git & Version Control
Panduan penggunaan Git untuk project ini.

- **[GIT_SETUP.md](docs/git/GIT_SETUP.md)** - Setup Git untuk project
- **[GIT_WORKFLOW_GUIDE.md](docs/git/GIT_WORKFLOW_GUIDE.md)** - Workflow Git yang direkomendasikan
- **[FIRST_COMMIT.md](docs/git/FIRST_COMMIT.md)** - Panduan commit pertama

### 💻 Development
Dokumentasi untuk development dan improvement.

- **[ROADMAP.md](docs/development/ROADMAP.md)** - Roadmap pengembangan aplikasi
- **[QUICK_IMPROVEMENTS.md](docs/development/QUICK_IMPROVEMENTS.md)** - Improvement cepat yang bisa dilakukan
- **[PROJECT_REVIEW_AND_IMPROVEMENTS.md](docs/development/PROJECT_REVIEW_AND_IMPROVEMENTS.md)** - Review dan improvement project
- **[TESTING_LAPORAN.md](docs/development/TESTING_LAPORAN.md)** - Testing fitur laporan

### 📊 Fitur & Sistem
Dokumentasi fitur-fitur aplikasi.

- **[docs/features/](docs/features/)** - Index fitur & sistem
  - **[laporan/](docs/features/laporan/)** - Dokumentasi fitur laporan
    - [LAPORAN_SYSTEM.md](docs/features/laporan/LAPORAN_SYSTEM.md) - Sistem laporan
    - [LAPORAN_QUICK_START.md](docs/features/laporan/LAPORAN_QUICK_START.md) - Quick start laporan
    - [CHANGELOG_LAPORAN.md](docs/features/laporan/CHANGELOG_LAPORAN.md) - Changelog laporan
  - **[sistem/](docs/features/sistem/)** - Dokumentasi sistem & workflow
    - [KOORDINATOR_TEST_SYSTEM.md](docs/features/sistem/KOORDINATOR_TEST_SYSTEM.md) - Sistem koordinator
    - [POOL_CAPACITY_SYSTEM.md](docs/features/sistem/POOL_CAPACITY_SYSTEM.md) - Sistem pool capacity
    - [QUICK_START.md](docs/features/sistem/QUICK_START.md) - Quick start guide
    - [QUICK_REFERENCE.md](docs/features/sistem/QUICK_REFERENCE.md) - Referensi cepat

### 📐 Diagram
Diagram alur sistem.

- **[docs/diagrams/](docs/diagrams/)** - Index diagram
  - [DIAGRAM_ALUR.txt](docs/diagrams/DIAGRAM_ALUR.txt) - Diagram alur sistem
  - [LAPORAN_DIAGRAM.txt](docs/diagrams/LAPORAN_DIAGRAM.txt) - Diagram sistem laporan
  - [POOL_CAPACITY_DIAGRAM.txt](docs/diagrams/POOL_CAPACITY_DIAGRAM.txt) - Diagram pool capacity

---

## 🛠️ Scripts

### Database
- `npm run migrate-vps` - Migrasi database untuk VPS (lengkap)
- `npm run setup-db` - Setup database lokal
- `npm run build` - Inisialisasi database
- `npm run seed` - Seed data dummy

### Development
- `npm run dev` - Jalankan server development
- `npm start` - Jalankan server production

### Backup
- `scripts/backup/backup-db.sh` - Backup database
- `scripts/backup/setup-backup-cron.sh` - Setup auto backup

---

## 📁 Struktur Folder

```
.
├── docs/                          # Dokumentasi
│   ├── deployment/                # Panduan deployment
│   ├── git/                       # Panduan Git
│   ├── development/               # Dokumentasi development
│   └── troubleshooting/           # Troubleshooting guides
├── public/                        # Frontend files
│   ├── index.html                 # Halaman utama
│   ├── admin.html                 # Halaman admin
│   ├── login.html                 # Halaman login
│   └── laporan.html               # Halaman laporan
├── netlify/functions/             # API endpoints
│   ├── students.js                # API siswa
│   ├── users.js                   # API users
│   └── teachers.js                # API guru
├── scripts/                       # Utility scripts
│   ├── backup/                    # Backup scripts
│   ├── migrate-db-vps.js          # Migrasi database VPS
│   └── ...                        # Script lainnya
├── data/                          # Database SQLite
│   └── antrian.db                 # Database file
├── server-local.js                # Local development server
├── ecosystem.config.js            # PM2 configuration
└── package.json                   # NPM dependencies
```

---

## 🔐 Default Credentials

Setelah setup database:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| posruang | posruang123 | POS_RUANG |
| koordinator | koordinator123 | KOORDINATOR_RUANG_TEST |
| petugasantar | petugasantar123 | PETUGAS_ANTAR |
| penguji1 | penguji123 | PENGUJI_MEJA_1 |
| penguji2 | penguji123 | PENGUJI_MEJA_2 |
| penguji3 | penguji123 | PENGUJI_MEJA_3 |
| penguji4 | penguji123 | PENGUJI_MEJA_4 |
| penguji5 | penguji123 | PENGUJI_MEJA_5 |

⚠️ **PENTING:** Ganti password setelah login pertama kali!

---

## 🆘 Butuh Bantuan?

1. **Masalah login di VPS?** → [VPS_LOGIN_FIX.md](docs/troubleshooting/VPS_LOGIN_FIX.md)
2. **Cara deploy?** → [QUICK_DEPLOY.md](docs/deployment/QUICK_DEPLOY.md)
3. **Setup Git?** → [GIT_SETUP.md](docs/git/GIT_SETUP.md)
4. **Mulai development?** → [START_HERE.md](START_HERE.md)

---

## 📞 Support

Untuk pertanyaan atau masalah, silakan buka issue atau hubungi tim development.

---

**Versi:** 1.0.0  
**Terakhir diupdate:** 10 Februari 2026
