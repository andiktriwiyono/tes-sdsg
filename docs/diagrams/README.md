# 📐 Diagram Sistem

Folder ini berisi diagram alur dan visualisasi sistem.

---

## 📋 File-file

### 1. [DIAGRAM_ALUR.txt](DIAGRAM_ALUR.txt)
**Diagram alur sistem lengkap**

Berisi:
- Alur siswa dari daftar sampai selesai
- Workflow setiap role
- Decision points
- Auto-move mechanism
- Pool capacity control

**Gunakan untuk:** Memahami alur sistem secara visual

---

### 2. [LAPORAN_DIAGRAM.txt](LAPORAN_DIAGRAM.txt)
**Diagram sistem laporan**

Berisi:
- Alur generate laporan
- Data flow
- Export process
- Print process

**Gunakan untuk:** Memahami sistem laporan secara visual

---

### 3. [POOL_CAPACITY_DIAGRAM.txt](POOL_CAPACITY_DIAGRAM.txt)
**Diagram pool capacity system**

Berisi:
- Pool capacity control (max 5)
- Queue management
- Overflow handling
- FIFO implementation

**Gunakan untuk:** Memahami sistem pool capacity secara visual

---

## 🎯 Diagram Utama

### Alur Siswa
```
DAFTAR SISWA
    ↓
RUANG TUNGGU 1/2
    ↓ (Auto-move 10s)
POOL TEST (Max 5)
    ↓
MEJA 1-5
    ↓
SELESAI TEST
```

### Alur Laporan
```
DATA SISWA
    ↓
GENERATE STATISTIK
    ↓
DISPLAY LAPORAN
    ↓
EXPORT EXCEL / PRINT
```

### Pool Capacity Control
```
RUANG TUNGGU
    ↓
CHECK POOL CAPACITY
    ├─ < 5 siswa → MOVE TO POOL
    └─ = 5 siswa → WAIT IN QUEUE
```

---

## 📊 Visualisasi

### Role & Access
```
ADMIN
├─ Full Access
├─ User Management
└─ System Tools

POS_RUANG
├─ Daftar Siswa
└─ Ruang Tunggu

KOORDINATOR
├─ Pool Test
├─ Ploting ke Meja
└─ Monitor Meja

PETUGAS_ANTAR
├─ Antar ke Meja
└─ Jemput Selesai

PENGUJI
└─ Meja Sendiri
```

### Data Flow
```
USER INPUT
    ↓
FRONTEND (app.js)
    ↓
API (netlify/functions)
    ↓
DATABASE (SQLite)
    ↓
RESPONSE
    ↓
UI UPDATE
```

---

## 🔍 Cara Membaca Diagram

### Simbol
- `→` atau `↓` - Alur/flow
- `├─` - Branch/pilihan
- `└─` - End branch
- `[ ]` - Process/action
- `( )` - Condition/decision

### Contoh
```
[START]
    ↓
(Check condition)
    ├─ True → [Action A]
    └─ False → [Action B]
        ↓
    [END]
```

---

## 🔗 Link Terkait

- **Sistem:** [../features/sistem/](../features/sistem/)
- **Laporan:** [../features/laporan/](../features/laporan/)
- **Development:** [../development/](../development/)
- **Kembali ke Index:** [../../INDEX.md](../../INDEX.md)

---

## 💡 Tips

### Untuk Developer
- Gunakan diagram untuk memahami flow sebelum coding
- Update diagram saat ada perubahan sistem
- Referensi diagram saat code review

### Untuk User
- Gunakan diagram untuk memahami workflow
- Referensi saat training user baru
- Troubleshooting dengan melihat alur

---

**Kembali ke:** [INDEX.md](../../INDEX.md)
