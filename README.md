# 🎓 Sistem Antrian Test - SD Sunangiri

Sistem manajemen antrian test siswa dengan multi-role user, auto-move system, dan real-time updates.

---

## 🚀 Quick Start

### Development Lokal
```bash
npm install
npm run dev
```
Akses: http://localhost:8888

### Deployment ke VPS
📖 **Baca dokumentasi lengkap di [START_HERE.md](START_HERE.md)**

---

## ✨ Fitur Utama

### 🎯 Core Features
- ✅ **Multi-Role System**: 9 role berbeda dengan permission spesifik
- ✅ **Auto-Move System**: Siswa otomatis pindah dari Ruang Tunggu ke Pool Test (10 detik)
- ✅ **Pool Capacity Control**: Maksimal 5 siswa di Pool Test
- ✅ **FIFO Queue System**: 3 antrian independen dengan strict ordering
- ✅ **Drag & Drop**: Desktop mode (drag & drop antar ruangan)
- ✅ **Mobile Friendly**: Touch-optimized dengan tombol aksi
- ✅ **Real-time Timer**: Countdown auto-move dan durasi test
- ✅ **Filter Sesi**: Filter siswa berdasarkan sesi (1, 2, 3)
- ✅ **Database SQLite**: Ringan dan cepat
- ✅ **Responsive Design**: Desktop & mobile optimized

### 🏢 Ruangan
1. **Daftar Siswa** - Siswa terdaftar (dengan search & filter sesi)
2. **Ruang Tunggu 1** - Menunggu test (FIFO + auto-move 10s)
3. **Ruang Tunggu 2** - Menunggu test (FIFO + auto-move 10s)
4. **Pool Ruang Test** - Antri Test (FIFO strict, max 5 siswa)
5. **Meja 1-5** - 5 meja penguji (kapasitas 1 siswa/meja)
6. **Selesai Test (T1)** - Siswa selesai dari Tunggu 1
7. **Selesai Test (T2)** - Siswa selesai dari Tunggu 2

### 👥 Role & Permissions

#### 1. Admin (👑)
- Full access ke semua fitur
- Manajemen user & guru/penguji
- Reset data & system tools

#### 2. Pos Ruang (📋)
- Daftar Siswa → Ruang Tunggu 1/2
- Monitor Selesai Test

#### 3. Koordinator Ruang Test (🎯)
- Monitor Ruang Tunggu 1/2
- Ploting siswa dari Pool Test ke Meja
- Monitor semua meja penguji

#### 4. Petugas Antar-Jemput (🚶)
- Antar siswa dari Pool Test ke Meja
- Jemput siswa selesai test ke Ruang Selesai

#### 5. Penguji Meja 1-5 (📝)
- Hanya akses meja sendiri
- Tandai siswa selesai test

---

## 🎯 Pembagian Sesi

Sistem otomatis membagi siswa berdasarkan nomor pendaftaran:

- **Sesi 1:** Nomor Pendaftaran 1-35 (35 siswa)
- **Sesi 2:** Nomor Pendaftaran 36-71 (35 siswa)
- **Sesi 3:** Nomor Pendaftaran 72-106 (35 siswa)

---

## 🔐 Default Login

**Username:** `admin`  
**Password:** `admin123`

⚠️ **PENTING:** Ganti password setelah deployment pertama!

---

## 📚 Dokumentasi Deployment

### Untuk Deploy ke VPS (tes.sdsunangiri.sch.id)

Ikuti urutan ini:

1. **[START_HERE.md](START_HERE.md)** - 🎯 Panduan utama (MULAI DI SINI!)
2. **[FIRST_COMMIT.md](FIRST_COMMIT.md)** - Cara commit kode ke Git pertama kali
3. **[GIT_SETUP.md](GIT_SETUP.md)** - Setup Git repository lengkap
4. **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Panduan cepat deploy (3 langkah)
5. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Panduan lengkap + troubleshooting
6. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Checklist deployment

### Dokumentasi Sistem

- **[KOORDINATOR_TEST_SYSTEM.md](docs/KOORDINATOR_TEST_SYSTEM.md)** - Sistem Koordinator Test
- **[POOL_CAPACITY_SYSTEM.md](docs/POOL_CAPACITY_SYSTEM.md)** - Sistem kapasitas Pool Test
- **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick reference guide
- **[DIAGRAM_ALUR.txt](docs/DIAGRAM_ALUR.txt)** - Visual diagram alur

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (sql.js)
- **Frontend:** Vanilla JavaScript + Tailwind CSS
- **Process Manager:** PM2
- **Web Server:** Nginx
- **Version Control:** Git

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/username/antrian-test-sdsunangiri.git
cd antrian-test-sdsunangiri

# Install dependencies
npm install

# Setup database
npm run setup-db

# Seed data (opsional)
node scripts/seed-with-gender.js

# Run development server
npm run dev
```

---

## 🚀 Deployment ke VPS

### Quick Deploy (3 Langkah)

**1. Push ke Git**
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
git clone <your-repo-url> antrian-test
cd antrian-test
npm install
npm run setup-db
pm2 start ecosystem.config.js
pm2 save
```

📖 **Lihat [QUICK_DEPLOY.md](QUICK_DEPLOY.md) untuk panduan lengkap**

---

## 🔄 Update Workflow

### Development (Lokal)
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Production (VPS)
```bash
cd /var/www/antrian-test
git pull origin main
npm install
pm2 restart antrian-test
```

---

## 📊 Struktur Project

```
antrian-test/
├── public/                 # Frontend files
│   ├── index.html         # Main app
│   ├── login.html         # Login page
│   ├── admin.html         # Admin panel
│   ├── app.js             # Main app logic
│   └── admin.js           # Admin logic
├── netlify/functions/     # API endpoints
│   ├── students.js        # Students API
│   ├── users.js           # Users API
│   └── teachers.js        # Teachers API
├── scripts/               # Database scripts
│   ├── init-db.js         # Initialize database
│   ├── add-sesi-column.js # Add session column
│   └── ...
├── data/                  # SQLite database
│   └── antrian.db
├── docs/                  # Documentation
├── server-local.js        # Production server
├── ecosystem.config.js    # PM2 configuration
└── package.json
```

---

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run setup-db     # Setup database with all migrations
npm run seed         # Seed sample data
```

---

## 🎯 Workflow Singkat

```
DAFTAR SISWA
    ↓ (POS_RUANG)
RUANG TUNGGU 1/2
    ↓ (AUTO-MOVE 10s)
POOL TEST (Antri Test, max 5)
    ↓ (KOORDINATOR: Ploting ke Meja)
MEJA 1-5 (Sedang Test)
    ↓ (PENGUJI: Selesai Test)
    ↓ (PETUGAS ANTAR: Antar Kembali)
SELESAI TEST (T1/T2)
```

---

## 🧪 Testing

1. Login sebagai **admin** / admin123
2. Tambah siswa atau gunakan seed data
3. Test workflow dari Daftar → Tunggu → Pool → Meja → Selesai
4. Test filter sesi (1, 2, 3)
5. Test semua role user

---

## 🐛 Troubleshooting

### Aplikasi tidak bisa diakses
```bash
pm2 logs antrian-test
sudo systemctl status nginx
```

### Database error
```bash
chmod 755 data
chmod 644 data/antrian.db
```

### Git pull error
```bash
git status
git stash
git pull origin main
```

📖 **Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk troubleshooting lengkap**

---

## 🔒 Security

- Database tidak di-commit ke Git
- SSL/HTTPS recommended untuk production
- Firewall VPS dikonfigurasi
- Regular backup database
- Ganti password default setelah deploy

---

## 📞 Support

Jika ada masalah:
1. Cek logs: `pm2 logs antrian-test`
2. Baca dokumentasi deployment
3. Lihat troubleshooting guide

---

## 🎯 Roadmap

- [ ] Export data ke Excel
- [ ] Print laporan
- [ ] Statistik & analytics
- [ ] Notifikasi real-time
- [ ] Mobile app (PWA)

---

## 📄 License

Private - SD Sunangiri

---

## 👨‍💻 Developer

Dibuat untuk SD Sunangiri dengan ❤️

---

**Domain Production:** tes.sdsunangiri.sch.id
