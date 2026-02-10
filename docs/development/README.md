# 💻 Development

Folder ini berisi dokumentasi untuk development dan improvement aplikasi.

---

## 📋 File-file

### 1. [ROADMAP.md](ROADMAP.md)
**Roadmap pengembangan aplikasi**

Berisi:
- Fitur yang sudah selesai
- Fitur yang sedang dikembangkan
- Fitur yang direncanakan
- Timeline development

**Gunakan untuk:** Planning dan tracking progress development

---

### 2. [QUICK_IMPROVEMENTS.md](QUICK_IMPROVEMENTS.md)
**Improvement cepat yang bisa dilakukan**

Berisi:
- Quick wins (improvement mudah)
- Bug fixes
- UI/UX improvements
- Performance optimization
- Security improvements

**Gunakan untuk:** Mencari task development yang cepat

---

### 3. [PROJECT_REVIEW_AND_IMPROVEMENTS.md](PROJECT_REVIEW_AND_IMPROVEMENTS.md)
**Review dan improvement project**

Berisi:
- Code review
- Architecture review
- Best practices
- Refactoring suggestions
- Long-term improvements

**Gunakan untuk:** Planning improvement jangka panjang

---

### 4. [TESTING_LAPORAN.md](TESTING_LAPORAN.md)
**Testing fitur laporan**

Berisi:
- Test cases untuk fitur laporan
- Testing checklist
- Bug reports
- Test results

**Gunakan untuk:** Testing fitur laporan

---

## 🛠️ Development Workflow

### Setup Development Environment
```bash
# Clone repository
git clone <repo-url>
cd antrian-test

# Install dependencies
npm install

# Setup database
node scripts/migrate-db-vps.js

# Run development server
npm run dev
```

Akses: http://localhost:8888

### Development Cycle
1. **Buat branch baru** (opsional)
   ```bash
   git checkout -b feature/nama-fitur
   ```

2. **Edit kode**
   - Edit file di `public/`, `netlify/functions/`, atau `scripts/`
   - Test di browser

3. **Test perubahan**
   - Test manual di browser
   - Test semua role user
   - Test di mobile & desktop

4. **Commit & push**
   ```bash
   git add .
   git commit -m "Add feature X"
   git push origin feature/nama-fitur
   ```

5. **Deploy ke VPS**
   ```bash
   # Di VPS
   cd /var/www/antrian-test
   git pull origin main
   pm2 restart antrian-test
   ```

---

## 📁 Struktur Code

### Frontend (`public/`)
- `index.html` - Main app (dashboard antrian)
- `app.js` - Main app logic
- `login.html` - Login page
- `admin.html` - Admin panel
- `admin.js` - Admin logic
- `laporan.html` - Laporan page
- `laporan.js` - Laporan logic

### Backend (`netlify/functions/`)
- `students.js` - API siswa (CRUD, move, dll)
- `users.js` - API users (login, CRUD)
- `teachers.js` - API guru/penguji (CRUD)

### Database Scripts (`scripts/`)
- `migrate-db-vps.js` - Migrasi database lengkap
- `init-db.js` - Inisialisasi database
- `add-*.js` - Migration scripts
- `seed-*.js` - Seed data scripts

### Server
- `server-local.js` - Local development server
- `ecosystem.config.js` - PM2 configuration

---

## 🎯 Fitur yang Bisa Dikembangkan

### Priority High
- [ ] Notifikasi real-time (WebSocket/SSE)
- [ ] Export PDF laporan
- [ ] Grafik visualisasi (Chart.js)
- [ ] Filter laporan berdasarkan tanggal

### Priority Medium
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Backup otomatis ke cloud

### Priority Low
- [ ] Email notification
- [ ] SMS notification
- [ ] QR code untuk siswa
- [ ] Barcode scanner

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] Login semua role berhasil
- [ ] Tambah siswa berhasil
- [ ] Move siswa antar ruangan berhasil
- [ ] Auto-move 10 detik berfungsi
- [ ] Pool capacity (max 5) berfungsi
- [ ] FIFO queue berfungsi
- [ ] Filter sesi berfungsi
- [ ] Export Excel berhasil
- [ ] Print laporan berhasil

### UI/UX Testing
- [ ] Responsive di mobile
- [ ] Responsive di tablet
- [ ] Responsive di desktop
- [ ] Drag & drop smooth
- [ ] Touch gestures work
- [ ] Loading states clear
- [ ] Error messages helpful

### Performance Testing
- [ ] Load time < 3 detik
- [ ] Smooth dengan 100+ siswa
- [ ] No memory leaks
- [ ] Database queries optimized

### Security Testing
- [ ] Authentication required
- [ ] Role-based access control
- [ ] SQL injection protected
- [ ] XSS protected
- [ ] CSRF protected

---

## 🐛 Bug Reporting

Jika menemukan bug, catat:
1. **Deskripsi bug:** Apa yang terjadi?
2. **Steps to reproduce:** Bagaimana cara reproduce?
3. **Expected behavior:** Apa yang seharusnya terjadi?
4. **Actual behavior:** Apa yang benar-benar terjadi?
5. **Screenshots:** (jika ada)
6. **Browser/Device:** Browser dan device apa?
7. **User role:** Login sebagai role apa?

---

## 📝 Code Style Guide

### JavaScript
- Use `const` dan `let`, hindari `var`
- Use arrow functions
- Use template literals
- Use async/await untuk async code
- Add comments untuk logic kompleks

### HTML
- Use semantic HTML
- Add ARIA labels untuk accessibility
- Use Tailwind CSS classes

### CSS
- Use Tailwind CSS utility classes
- Minimal custom CSS
- Mobile-first approach

---

## 🔗 Link Terkait

- **Deployment:** [../deployment/](../deployment/)
- **Git Workflow:** [../git/](../git/)
- **Troubleshooting:** [../troubleshooting/](../troubleshooting/)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**Kembali ke:** [INDEX.md](../../INDEX.md)
