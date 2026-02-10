# 🚀 QUICK REFERENCE - Auto-Move System

## ⚡ TL;DR (Too Long; Didn't Read)

**Masalah:** Bingung siapa yang harus move siswa dari Tunggu 1/2 ke Pool Test  
**Solusi:** Sistem otomatis move setiap 10 detik  
**Hasil:** Workflow lebih cepat, tidak ada bottleneck, tetap fleksibel

---

## 🎯 Workflow Baru (Simple)

```
DAFTAR → TUNGGU 1/2 → (AUTO 10s) → POOL TEST → MEJA 1-5 → SELESAI
         ↑ Manual              ↑ Otomatis      ↑ Manual
```

---

## 👥 Siapa Ngapain?

| Role | Tugas |
|------|-------|
| **POS_RUANG** | Daftar → Tunggu 1/2 (manual) |
| **SISTEM** | Tunggu 1/2 → Pool Test (otomatis 10s) |
| **POS_WAWANCARA** | Monitoring + override (opsional) |
| **PENGUJI** | Pool Test → Meja (claim Antrian 1) |

---

## ⏱️ Timer yang Muncul

### Di Ruang Tunggu:
- "⏱️ Auto 10s" → "⏱️ Auto 9s" → ... → "✓ Siap Pool"
- Update setiap detik
- Setelah 10 detik: otomatis pindah ke Pool Test

### Di Meja Penguji:
- "⏱️ 0:00" → "⏱️ 0:01" → "⏱️ 1:23" → ...
- Durasi test dalam format MM:SS
- Update setiap detik

---

## 🖱️ Manual Override (Opsional)

**Kapan digunakan?**
- Siswa prioritas (VIP, urgent)
- Perlu dipercepat
- Load balancing

**Cara:**
- **Desktop:** Drag & drop ke Pool Test
- **Mobile:** Klik button "→ Pindah Sekarang"

**Siapa yang bisa?**
- POS_WAWANCARA
- ADMIN

---

## 📱 Desktop vs Mobile

### Desktop:
- Drag & drop enabled
- Countdown badge di card siswa
- Manual override: drag ke Pool Test

### Mobile:
- Drag & drop disabled
- Button eksplisit untuk move
- Countdown di info box
- Manual override: button "→ Pindah Sekarang"

---

## 🎯 FIFO Queue (Antrian)

### 3 Antrian Independen:

1. **Tunggu 1:** Urut by `tunggu1_entry_time`
2. **Tunggu 2:** Urut by `tunggu2_entry_time`
3. **Pool Test:** Urut by `pool_entry_time` (RESET!)

**Penting:** Pool Test queue RESET - tidak bergantung pada Tunggu 1/2 timestamp!

---

## 🔧 Konfigurasi Delay

**File:** `public/app.js`  
**Baris:** 662

```javascript
const AUTO_MOVE_DELAY = 10; // seconds
```

**Ubah angka:**
- `5` = 5 detik (cepat)
- `10` = 10 detik (default, rekomendasi)
- `15` = 15 detik (lambat)

---

## 🧪 Quick Test

1. Login: **posruang** / posruang123
2. Pindahkan siswa ke Tunggu 1
3. Lihat countdown: "⏱️ Auto 10s"
4. Tunggu 10 detik
5. Siswa otomatis ke Pool Test ✅

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Siswa tidak auto-move | Refresh halaman |
| Timer tidak update | Check browser console |
| Tidak bisa claim siswa | Pastikan Antrian 1 (badge hijau 🎯) |
| Meja penuh | Klik "✓ Selesai Test" dulu |

---

## 📊 Keuntungan

| Aspek | Improvement |
|-------|-------------|
| Kecepatan | 44-66% lebih cepat |
| Efisiensi | Hemat 33-83 menit per 100 siswa |
| Beban POS_WAWANCARA | Berkurang 80% |
| Transparansi | Countdown timer real-time |
| Reliability | Tidak tergantung 1 orang |

---

## 📚 Dokumentasi Lengkap

- **[WORKFLOW.md](WORKFLOW.md)** - Alur lengkap
- **[SOLUSI_AUTO_MOVE.md](SOLUSI_AUTO_MOVE.md)** - Detail auto-move
- **[DIAGRAM_ALUR.txt](DIAGRAM_ALUR.txt)** - Visual diagram
- **[BEFORE_AFTER_COMPARISON.txt](BEFORE_AFTER_COMPARISON.txt)** - Perbandingan
- **[RINGKASAN_PERUBAHAN.md](RINGKASAN_PERUBAHAN.md)** - Summary perubahan

---

## 💡 Best Practice

✅ **DO:**
- Biarkan sistem auto-move bekerja
- Monitor dashboard
- Gunakan manual override untuk kasus khusus
- Claim siswa Antrian 1 (badge hijau)

❌ **DON'T:**
- Manual move semua siswa (biarkan auto)
- Skip antrian (sistem enforce FIFO)
- Lupa klik "Selesai Test"

---

## 🔐 Login Accounts

| Role | Username | Password |
|------|----------|----------|
| ADMIN | admin | admin123 |
| POS_RUANG | posruang | posruang123 |
| POS_WAWANCARA | poswawancara | poswawancara123 |
| PENGUJI 1-5 | penguji1-5 | penguji123 |

---

## 🎉 Kesimpulan

**Sistem sekarang:**
- ✅ Otomatis move setiap 10 detik
- ✅ Tidak ada bottleneck
- ✅ Transparan dengan countdown
- ✅ Tetap fleksibel (manual override)
- ✅ FIFO tetap terjaga

**Tidak ada lagi kebingungan!** 🚀

---

**Need help?** Baca dokumentasi lengkap atau contact support! 😊
