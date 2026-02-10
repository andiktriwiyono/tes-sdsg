# 🎯 Pool Test Capacity System (Max 5 Siswa)

## 📋 Overview

Sistem sekarang membatasi **Pool Ruang Test** hanya bisa menampung **maksimal 5 siswa** sesuai dengan jumlah meja penguji yang tersedia.

---

## 🎯 Konsep

### Mengapa 5 Siswa?
- Ada **5 Meja Penguji** (Meja 1-5)
- Setiap meja kapasitas **1 siswa**
- Pool Test sebagai "waiting room" untuk penguji
- **Tidak perlu** lebih dari 5 siswa di Pool Test karena semua meja sudah terisi

### Keuntungan:
✅ **Efisien** - Tidak ada siswa menunggu sia-sia di Pool Test  
✅ **Terorganisir** - Pool Test tidak overcrowded  
✅ **Fair** - Siswa di Ruang Tunggu tahu kapan giliran mereka  
✅ **Transparan** - Countdown pause jika Pool penuh  
✅ **Optimal** - Alur siswa smooth tanpa bottleneck  

---

## 🔄 Alur Baru dengan Capacity Limit

### Scenario 1: Pool Test Belum Penuh (< 5 siswa)

```
RUANG TUNGGU 1/2
  Siswa A: ⏱️ Auto 10s → 9s → ... → 1s → ✓ Siap Pool
  ↓ (Auto-move setelah 10 detik)
POOL TEST (3/5) ← Masih ada slot
  ↓ (Penguji claim)
MEJA 1-5
```

**Behavior:**
- Countdown berjalan normal
- Setelah 10 detik, siswa otomatis pindah ke Pool Test
- Badge: "⏱️ Auto 10s" → "✓ Siap Pool"

---

### Scenario 2: Pool Test Penuh (5/5 siswa)

```
RUANG TUNGGU 1/2
  Siswa B: ⏸️ Pool Penuh (7s) ← Countdown pause
  Siswa C: ⏸️ Pool Penuh (5s)
  Siswa D: ⏸️ Pool Penuh (3s)
  ↓ (Menunggu slot kosong)
POOL TEST (5/5) ← PENUH!
  Siswa 1: 🎯 Antrian 1 (ready)
  Siswa 2: ⏳ Antrian 2
  Siswa 3: ⏳ Antrian 3
  Siswa 4: ⏳ Antrian 4
  Siswa 5: ⏳ Antrian 5
  ↓ (Penguji claim Antrian 1)
MEJA 1-5
  ↓ (Selesai test)
SELESAI TEST
```

**Behavior:**
- Countdown tetap jalan tapi tidak auto-move
- Badge berubah: "⏱️ Auto 7s" → "⏸️ Pool Penuh (7s)"
- Siswa menunggu sampai ada slot kosong di Pool Test
- Begitu ada slot kosong (penguji claim siswa), auto-move resume

---

### Scenario 3: Slot Kosong Tersedia

```
POOL TEST (5/5) ← Penuh
  ↓ Penguji claim Siswa 1
POOL TEST (4/5) ← Ada slot!
  ↓ Sistem detect slot kosong
RUANG TUNGGU 1/2
  Siswa B: ⏸️ Pool Penuh → ✓ Siap Pool
  ↓ Auto-move immediately (FIFO)
POOL TEST (5/5) ← Penuh lagi
```

**Behavior:**
- Sistem detect slot kosong setiap 2 detik
- Siswa yang paling lama menunggu (FIFO) langsung pindah
- Badge: "⏸️ Pool Penuh" → "✓ Siap Pool" → Pindah!

---

## 🎨 Visual Indicators

### 1. Pool Test Header (Capacity Badge)

```
┌─────────────────────────────────────┐
│ 📝 Pool Ruang Test [3/5]           │ ← Badge hijau (< 3 siswa)
│ Siap diambil penguji (Max 5 siswa) │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📝 Pool Ruang Test [4/5]           │ ← Badge amber (3-4 siswa)
│ Siap diambil penguji (Max 5 siswa) │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📝 Pool Ruang Test [5/5]           │ ← Badge merah (5 siswa - PENUH!)
│ Siap diambil penguji (Max 5 siswa) │
└─────────────────────────────────────┘
```

**Color Coding:**
- **Hijau** (0-2 siswa): Banyak slot tersedia
- **Amber** (3-4 siswa): Hampir penuh
- **Merah** (5 siswa): PENUH!

---

### 2. Siswa di Ruang Tunggu (Pool Belum Penuh)

```
┌─────────────────────────────────────┐
│ #001 👦 Laki-laki 📋 Antrian 1      │
│ ⏱️ Auto 7s                          │ ← Countdown normal
│ Ahmad Rizki                         │
│ 👨‍👩‍👧 Bapak Rizki                      │
└─────────────────────────────────────┘
```

---

### 3. Siswa di Ruang Tunggu (Pool Penuh)

```
┌─────────────────────────────────────┐
│ #001 👦 Laki-laki 📋 Antrian 1      │
│ ⏸️ Pool Penuh (7s)                  │ ← Countdown pause
│ Ahmad Rizki                         │
│ 👨‍👩‍👧 Bapak Rizki                      │
└─────────────────────────────────────┘
```

---

### 4. Mobile View (Pool Belum Penuh)

```
┌─────────────────────────────────────┐
│ #001 👦 Laki-laki 📋 Antrian 1      │
│ Ahmad Rizki                         │
│ 👨‍👩‍👧 Bapak Rizki                      │
│ ┌─────────────────────────────────┐ │
│ │ ⏱️ Auto ke Pool dalam 7s        │ │
│ │ Pool: 3/5 siswa                 │ │ ← Info capacity
│ │ [→ Pindah Sekarang]             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### 5. Mobile View (Pool Penuh)

```
┌─────────────────────────────────────┐
│ #001 👦 Laki-laki 📋 Antrian 1      │
│ Ahmad Rizki                         │
│ 👨‍👩‍👧 Bapak Rizki                      │
│ ┌─────────────────────────────────┐ │
│ │ ⏸️ Pool Test Penuh (5/5)        │ │
│ │ Tunggu meja kosong...           │ │ ← Warning
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### 1. Constant Configuration

```javascript
const POOL_TEST_CAPACITY = 5; // maximum students in Pool Test
```

**Dapat diubah sesuai kebutuhan:**
- `3` = Max 3 siswa (jika hanya 3 meja aktif)
- `5` = Max 5 siswa (default - semua meja)
- `10` = Max 10 siswa (jika ada 10 meja)

---

### 2. Auto-Move Logic (Updated)

```javascript
async function checkAutoMove() {
  // 1. Count current students in Pool Test
  const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
  
  // 2. If Pool Test is full, don't auto-move
  if (poolTestCount >= POOL_TEST_CAPACITY) {
    console.log('Pool Test is full. Waiting for space...');
    return;
  }
  
  // 3. Calculate available slots
  const availableSlots = POOL_TEST_CAPACITY - poolTestCount;
  
  // 4. Get students ready to move (FIFO)
  const readyStudents = [...]; // Students with elapsed >= 10s
  
  // 5. Sort by entry time (oldest first - FIFO)
  readyStudents.sort((a, b) => a.entryTime - b.entryTime);
  
  // 6. Move only up to available slots
  const studentsToMove = readyStudents.slice(0, availableSlots);
  
  // 7. Move students
  for (const student of studentsToMove) {
    // Move to Pool Test
  }
}
```

**Key Points:**
- Check capacity BEFORE auto-move
- Calculate available slots
- FIFO across both Tunggu 1 and Tunggu 2
- Move only up to available slots

---

### 3. Manual Move (Drag & Drop / Button)

```javascript
// Check capacity before manual move
if (targetLocation === 'test') {
  const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
  if (poolTestCount >= 5) {
    showMessage('Pool Test sudah penuh (5/5)! Tunggu meja kosong.', 'error');
    return; // Block move
  }
}
```

**Behavior:**
- Manual move juga di-block jika Pool penuh
- Error message ditampilkan
- User harus tunggu slot kosong

---

### 4. Visual Indicator Update

```javascript
// Update Pool Test capacity display
const poolCapacityEl = document.getElementById('pool-capacity');
poolCapacityEl.textContent = `${counts.test}/5`;

// Change color based on capacity
if (counts.test < 3) {
  poolCapacityEl.classList.add('bg-green-500'); // Hijau
} else if (counts.test < 5) {
  poolCapacityEl.classList.add('bg-amber-500'); // Amber
} else {
  poolCapacityEl.classList.add('bg-red-500'); // Merah
}
```

---

## 📊 Comparison: Before vs After

### ❌ Before (No Capacity Limit)

```
RUANG TUNGGU 1: 20 siswa
RUANG TUNGGU 2: 15 siswa
  ↓ Auto-move setiap 10 detik
POOL TEST: 35 siswa ← OVERCROWDED!
  ↓ Penguji claim 1 siswa
MEJA 1-5: 5 siswa testing
```

**Masalah:**
- Pool Test overcrowded (35 siswa!)
- 30 siswa menunggu sia-sia di Pool Test
- Tidak efisien - banyak siswa idle
- Sulit tracking antrian

---

### ✅ After (With Capacity Limit)

```
RUANG TUNGGU 1: 20 siswa
  Siswa 1-3: ⏱️ Auto countdown
  Siswa 4-20: ⏸️ Pool Penuh (waiting)
RUANG TUNGGU 2: 15 siswa
  Siswa 1-2: ⏱️ Auto countdown
  Siswa 3-15: ⏸️ Pool Penuh (waiting)
  ↓ Auto-move hanya jika ada slot
POOL TEST: 5 siswa ← OPTIMAL!
  ↓ Penguji claim 1 siswa
MEJA 1-5: 5 siswa testing
  ↓ Selesai test
POOL TEST: 4 siswa ← Slot kosong!
  ↓ Auto-move 1 siswa dari Tunggu (FIFO)
POOL TEST: 5 siswa ← Penuh lagi
```

**Keuntungan:**
- Pool Test optimal (5 siswa)
- Siswa menunggu di Ruang Tunggu (lebih nyaman)
- Efisien - tidak ada siswa idle di Pool Test
- Mudah tracking antrian
- Transparan - siswa tahu kapan giliran mereka

---

## 🎯 FIFO Logic (Updated)

### FIFO Across Both Waiting Rooms

Ketika Pool Test ada slot kosong, sistem memilih siswa berdasarkan:

1. **Elapsed time >= 10 detik** (sudah siap)
2. **Entry time paling lama** (FIFO)
3. **Tidak peduli dari Tunggu 1 atau Tunggu 2**

**Contoh:**

```
Tunggu 1:
  Siswa A: tunggu1_entry_time = 10:00:00 (elapsed 15s) ✓ Ready
  Siswa B: tunggu1_entry_time = 10:00:05 (elapsed 10s) ✓ Ready
  Siswa C: tunggu1_entry_time = 10:00:10 (elapsed 5s)  ✗ Not ready

Tunggu 2:
  Siswa D: tunggu2_entry_time = 10:00:02 (elapsed 13s) ✓ Ready
  Siswa E: tunggu2_entry_time = 10:00:08 (elapsed 7s)  ✗ Not ready

Pool Test: 4/5 (1 slot available)

FIFO Order (by entry time):
1. Siswa A (10:00:00) ← OLDEST, DIPILIH!
2. Siswa D (10:00:02)
3. Siswa B (10:00:05)

Result: Siswa A pindah ke Pool Test
```

---

## 🧪 Testing Scenarios

### Test 1: Normal Flow (Pool Not Full)

1. Pool Test: 2/5 siswa
2. Pindahkan 3 siswa ke Tunggu 1
3. Tunggu 10 detik
4. **Expected:** Semua 3 siswa auto-move ke Pool Test
5. Pool Test: 5/5 siswa ✓

---

### Test 2: Pool Full (Block Auto-Move)

1. Pool Test: 5/5 siswa (PENUH)
2. Pindahkan 2 siswa ke Tunggu 1
3. Tunggu 10 detik
4. **Expected:** Badge berubah "⏸️ Pool Penuh"
5. Siswa TIDAK pindah (tetap di Tunggu 1)
6. Pool Test: 5/5 siswa ✓

---

### Test 3: Slot Available (Resume Auto-Move)

1. Pool Test: 5/5 siswa (PENUH)
2. Tunggu 1: 3 siswa dengan badge "⏸️ Pool Penuh"
3. Penguji claim 1 siswa dari Pool Test
4. Pool Test: 4/5 siswa (ada slot!)
5. **Expected:** Siswa paling lama di Tunggu 1 auto-move
6. Pool Test: 5/5 siswa ✓

---

### Test 4: Manual Move Blocked

1. Pool Test: 5/5 siswa (PENUH)
2. Coba drag siswa dari Tunggu 1 ke Pool Test
3. **Expected:** Error message "Pool Test sudah penuh (5/5)!"
4. Siswa tetap di Tunggu 1 ✓

---

### Test 5: FIFO Across Waiting Rooms

1. Pool Test: 3/5 siswa
2. Tunggu 1: Siswa A (10:00:00), Siswa B (10:00:05)
3. Tunggu 2: Siswa C (10:00:02), Siswa D (10:00:08)
4. Tunggu 10 detik (semua ready)
5. **Expected:** Auto-move order: A → C → B (FIFO by entry time)
6. Pool Test: 5/5 siswa (A, C dari batch pertama) ✓

---

## 🎉 Benefits Summary

| Aspek | Before | After |
|-------|--------|-------|
| Pool Test Size | Unlimited (overcrowded) | Max 5 siswa (optimal) |
| Siswa Idle | Banyak di Pool Test | Minimal (hanya 5) |
| Efisiensi | Rendah | Tinggi |
| Transparansi | Tidak jelas | Jelas (capacity badge) |
| User Experience | Confusing | Clear & organized |
| System Load | Tinggi (banyak siswa) | Rendah (5 siswa max) |

---

## 🔧 Configuration

### Mengubah Kapasitas Pool Test

**File:** `public/app.js`  
**Baris:** 662

```javascript
const POOL_TEST_CAPACITY = 5; // maximum students in Pool Test
```

**Ubah sesuai kebutuhan:**
- Jika hanya 3 meja aktif → `const POOL_TEST_CAPACITY = 3;`
- Jika ada 10 meja → `const POOL_TEST_CAPACITY = 10;`

**Jangan lupa update UI:**

**File:** `public/index.html`  
**Cari:** `<span class="text-xs bg-white/20 px-2 py-0.5 rounded" id="pool-capacity">0/5</span>`  
**Ubah:** `0/5` → `0/3` atau `0/10` sesuai kapasitas

---

## 💡 Best Practices

### ✅ DO:
- Biarkan sistem auto-manage capacity
- Monitor capacity badge (hijau/amber/merah)
- Tunggu slot kosong jika Pool penuh
- Trust FIFO system (oldest first)

### ❌ DON'T:
- Jangan paksa manual move jika Pool penuh
- Jangan ubah kapasitas tanpa alasan jelas
- Jangan skip FIFO queue

---

## 🆘 Troubleshooting

### Siswa tidak auto-move padahal countdown selesai?
- **Check:** Apakah Pool Test penuh (5/5)?
- **Solution:** Tunggu penguji claim siswa dari Pool Test

### Badge tetap "⏸️ Pool Penuh" padahal Pool tidak penuh?
- **Check:** Refresh halaman
- **Solution:** Browser cache issue, hard refresh (Ctrl+F5)

### Manual move di-block padahal Pool tidak penuh?
- **Check:** Count siswa di Pool Test
- **Solution:** Refresh halaman untuk update data

---

## 🚀 Kesimpulan

Sistem **Pool Test Capacity Limit** membuat workflow lebih:
- ✅ **Efisien** - Tidak ada siswa idle di Pool Test
- ✅ **Terorganisir** - Pool Test tidak overcrowded
- ✅ **Transparan** - Capacity badge & countdown pause
- ✅ **Fair** - FIFO tetap terjaga
- ✅ **Optimal** - Alur siswa smooth

**Pool Test sekarang benar-benar berfungsi sebagai "waiting room" untuk penguji, bukan "parking lot" untuk siswa!** 🎉
