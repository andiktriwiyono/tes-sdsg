let studentsData = [];
let filteredStudentsData = []; // For search results in Daftar Siswa
let filteredSelesai1Data = []; // For search results in Selesai Test (T1)
let filteredSelesai2Data = []; // For search results in Selesai Test (T2)
let teachersData = []; // Teachers data from database
let currentSessionFilter = 'all'; // Session filter: 'all', '1', '2', '3'
let draggedElement = null;
let draggedStudentId = null;
let currentUser = null;
let isMobile = false;

// API URLs - gunakan /api/* untuk semua environment
const API_URL = '/api/students';
const TEACHERS_API_URL = '/api/teachers';

// Detect mobile device
function detectMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  const isSmallScreen = window.innerWidth < 768;
  return isMobileDevice || isSmallScreen;
}

// Update mobile detection on resize
window.addEventListener('resize', () => {
  const wasMobile = isMobile;
  isMobile = detectMobile();
  
  // Re-render if mobile state changed
  if (wasMobile !== isMobile) {
    updateModeIndicator();
    renderAllRooms();
  }
});

// Initialize mobile detection
isMobile = detectMobile();

// Check authentication
function checkAuth() {
  const userData = localStorage.getItem('currentUser');
  if (!userData) {
    window.location.href = '/login.html';
    return null;
  }
  return JSON.parse(userData);
}

// Initialize user session
function initUserSession() {
  currentUser = checkAuth();
  if (!currentUser) return;

  // Display user info
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-role').textContent = getRoleLabel(currentUser.role);

  // Show/hide elements based on role
  applyRolePermissions();
  
  // Update interaction mode indicator
  updateModeIndicator();
}

function updateModeIndicator() {
  const desktopMode = document.querySelector('.desktop-mode');
  const mobileMode = document.querySelector('.mobile-mode');
  
  if (isMobile) {
    desktopMode?.classList.add('hidden');
    mobileMode?.classList.remove('hidden');
  } else {
    desktopMode?.classList.remove('hidden');
    mobileMode?.classList.add('hidden');
  }
}

function getRoleLabel(role) {
  const labels = {
    'ADMIN': '👑 Administrator',
    'POS_RUANG': '📋 Pos Ruang',
    'KOORDINATOR_RUANG_TEST': '🎯 Koordinator Ruang Test',
    'PETUGAS_ANTAR': '🚶 Petugas Antar-Jemput',
    'PENGUJI_MEJA_1': '📝 Penguji Meja 1',
    'PENGUJI_MEJA_2': '📝 Penguji Meja 2',
    'PENGUJI_MEJA_3': '📝 Penguji Meja 3',
    'PENGUJI_MEJA_4': '📝 Penguji Meja 4',
    'PENGUJI_MEJA_5': '📝 Penguji Meja 5'
  };
  return labels[role] || role;
}

function applyRolePermissions() {
  const role = currentUser.role;

  // Hide/show rooms based on role
  if (role === 'POS_RUANG') {
    // Show: Daftar, Tunggu 1, Tunggu 2, Selesai Test rooms
    // Hide: Ruang Test, Meja Penguji
    hideElement(document.querySelector('#ruang-test')?.closest('.bg-white'));
    hideElement(document.querySelector('[id="stat-test"]')?.closest('.bg-gradient-to-br'));
    document.querySelectorAll('[id^="meja-"]').forEach(el => hideElement(el.closest('.bg-white')));
    document.querySelectorAll('[id^="stat-meja"]').forEach(el => hideElement(el.closest('.bg-gradient-to-br')));
  } else if (role === 'KOORDINATOR_RUANG_TEST') {
    // Show: Tunggu 1, Tunggu 2, Pool Test + All Meja Penguji (full flow monitoring)
    // Hide: Daftar, Selesai Test
    hideElement(document.querySelector('#daftar-siswa')?.closest('.bg-white'));
    hideElement(document.querySelector('#selesai-tunggu1')?.closest('.bg-white'));
    hideElement(document.querySelector('#selesai-tunggu2')?.closest('.bg-white'));
    hideElement(document.querySelector('[id="stat-daftar"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-selesai1"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-selesai2"]')?.closest('.bg-gradient-to-br'));
  } else if (role === 'PETUGAS_ANTAR') {
    // Show: Pool Test + All Meja Penguji + Selesai Test (untuk antar-jemput)
    // Hide: Daftar, Tunggu 1, Tunggu 2
    hideElement(document.querySelector('#daftar-siswa')?.closest('.bg-white'));
    hideElement(document.querySelector('#ruang-tunggu-1')?.closest('.bg-white'));
    hideElement(document.querySelector('#ruang-tunggu-2')?.closest('.bg-white'));
    hideElement(document.querySelector('[id="stat-daftar"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-tunggu1"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-tunggu2"]')?.closest('.bg-gradient-to-br'));
  } else if (role.startsWith('PENGUJI_MEJA_')) {
    // Show: Meja sendiri saja (tidak bisa lihat Pool Test lagi)
    // Hide: Daftar, Tunggu 1, Tunggu 2, Pool Test, Selesai Test, Meja lain
    hideElement(document.querySelector('#daftar-siswa')?.closest('.bg-white'));
    hideElement(document.querySelector('#ruang-tunggu-1')?.closest('.bg-white'));
    hideElement(document.querySelector('#ruang-tunggu-2')?.closest('.bg-white'));
    hideElement(document.querySelector('#ruang-test')?.closest('.bg-white'));
    hideElement(document.querySelector('#selesai-tunggu1')?.closest('.bg-white'));
    hideElement(document.querySelector('#selesai-tunggu2')?.closest('.bg-white'));
    hideElement(document.querySelector('[id="stat-daftar"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-tunggu1"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-tunggu2"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-test"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-selesai1"]')?.closest('.bg-gradient-to-br'));
    hideElement(document.querySelector('[id="stat-selesai2"]')?.closest('.bg-gradient-to-br'));
    
    // Hide other tables
    const myTable = role.split('_')[2]; // Extract table number
    for (let i = 1; i <= 5; i++) {
      if (i.toString() !== myTable) {
        hideElement(document.querySelector(`#meja-${i}`)?.closest('.bg-white'));
        hideElement(document.querySelector(`[id="stat-meja${i}"]`)?.closest('.bg-gradient-to-br'));
      }
    }
  }

  // Admin-only features
  if (role === 'ADMIN') {
    document.getElementById('admin-panel-btn')?.classList.remove('hidden');
  } else {
    // Hide add student form for non-admin
    const addSection = document.getElementById('add-student-section');
    if (addSection) addSection.style.display = 'none';
  }
}

function hideElement(element) {
  if (element) {
    element.style.display = 'none';
  }
}

// Logout function
document.getElementById('logout-btn').addEventListener('click', () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
  }
});

// Admin panel button
const adminPanelBtn = document.getElementById('admin-panel-btn');
if (adminPanelBtn) {
  adminPanelBtn.addEventListener('click', () => {
    window.location.href = '/admin.html';
  });
}

// Initialize on page load
initUserSession();

async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    studentsData = await response.json();
    renderAllRooms();
    updateStatistics();
    updateLastUpdate();
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

async function loadTeachers() {
  try {
    const response = await fetch(TEACHERS_API_URL);
    teachersData = await response.json();
    updateMejaHeaders();
  } catch (error) {
    console.error('Error loading teachers:', error);
  }
}

async function handleToggleBreak(e) {
  const btn = e.target;
  const mejaNumber = parseInt(btn.getAttribute('data-meja'));
  const currentStatus = parseInt(btn.getAttribute('data-current-status'));
  const newStatus = currentStatus === 1 ? 0 : 1; // Toggle
  
  // Confirm action
  const action = newStatus === 1 ? 'ISTIRAHAT' : 'AKTIFKAN';
  const message = newStatus === 1 
    ? `⏸️ Set Meja ${mejaNumber} ke mode ISTIRAHAT?\n\nMeja tidak akan menerima siswa baru dari Pool Test.\n\nSiswa yang sedang test bisa diselesaikan terlebih dahulu.`
    : `▶️ AKTIFKAN kembali Meja ${mejaNumber}?\n\nMeja akan bisa menerima siswa baru dari Pool Test.`;
  
  if (!confirm(message)) return;
  
  // Check if there's a student currently testing
  const studentAtMeja = studentsData.find(s => s.lokasi === `meja-${mejaNumber}`);
  if (newStatus === 1 && studentAtMeja && studentAtMeja.sudah_test !== 1) {
    const confirmWithStudent = confirm(
      `⚠️ Ada siswa sedang test di meja ini:\n\n` +
      `${studentAtMeja.nama_murid} (${studentAtMeja.no_pendaftaran})\n\n` +
      `Sebaiknya selesaikan test siswa ini dulu.\n\n` +
      `Tetap lanjutkan istirahat?`
    );
    if (!confirmWithStudent) return;
  }
  
  try {
    btn.disabled = true;
    btn.textContent = '⏳ Loading...';
    
    const response = await fetch(TEACHERS_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle_break',
        meja_number: mejaNumber,
        is_break: newStatus === 1
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle break status');
    }
    
    // Reload teachers data to update UI
    await loadTeachers();
    
    // Show success message
    const statusText = newStatus === 1 ? '🛑 ISTIRAHAT' : '✅ AKTIF';
    showMessage(`Meja ${mejaNumber} sekarang ${statusText}`, 'success');
    
  } catch (error) {
    console.error('Error toggling break:', error);
    showMessage('Gagal mengubah status istirahat', 'error');
    btn.disabled = false;
  }
}

function updateMejaHeaders() {
  // Group teachers by meja
  const teachersByMeja = {};
  teachersData.forEach(teacher => {
    if (!teachersByMeja[teacher.meja_number]) {
      teachersByMeja[teacher.meja_number] = [];
    }
    teachersByMeja[teacher.meja_number].push(teacher);
  });
  
  // Update each meja header
  for (let i = 1; i <= 5; i++) {
    const element = document.getElementById(`meja-${i}-teachers`);
    if (element) {
      const teachers = teachersByMeja[i] || [];
      const isBreak = teachers.length > 0 && teachers[0].is_break === 1;
      
      // Teacher names
      let teacherNames = '';
      if (teachers.length === 2) {
        teacherNames = `${teachers[0].teacher_name}<br>${teachers[1].teacher_name}`;
      } else if (teachers.length === 1) {
        teacherNames = teachers[0].teacher_name;
      } else {
        teacherNames = 'Guru belum diatur';
      }
      
      // Break status badge
      const breakBadge = isBreak 
        ? '<span class="inline-block mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">🛑 Istirahat</span>'
        : '<span class="inline-block mt-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">✅ Aktif</span>';
      
      // Toggle button for penguji (only show for their own meja)
      let toggleButton = '';
      if (currentUser && currentUser.role === `PENGUJI_MEJA_${i}`) {
        const buttonText = isBreak ? '▶️ Aktifkan' : '⏸️ Istirahat';
        const buttonColor = isBreak ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700';
        toggleButton = `
          <button 
            class="toggle-break-btn mt-2 w-full ${buttonColor} text-white text-xs py-1.5 px-2 rounded transition-colors font-medium"
            data-meja="${i}"
            data-current-status="${isBreak ? 1 : 0}">
            ${buttonText}
          </button>
        `;
      }
      
      element.innerHTML = `
        <div class="text-purple-100 text-sm leading-relaxed">
          ${teacherNames}
        </div>
        ${breakBadge}
        ${toggleButton}
      `;
    }
  }
  
  // Add event listeners for toggle buttons
  document.querySelectorAll('.toggle-break-btn').forEach(btn => {
    btn.addEventListener('click', handleToggleBreak);
  });
}

function updateLastUpdate() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('last-update').textContent = timeStr;
}

function createStudentCard(student) {
  const card = document.createElement('div');
  card.className = 'student-card bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md';
  
  // Only enable drag on desktop
  if (!isMobile) {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  }
  
  card.setAttribute('data-id', student.id);

  const statusColors = {
    'daftar': 'bg-emerald-100 text-emerald-700',
    'tunggu1': 'bg-amber-100 text-amber-700',
    'tunggu2': 'bg-orange-100 text-orange-700',
    'test': 'bg-indigo-100 text-indigo-700',
    'meja-1': 'bg-purple-100 text-purple-700',
    'meja-2': 'bg-purple-100 text-purple-700',
    'meja-3': 'bg-purple-100 text-purple-700',
    'meja-4': 'bg-purple-100 text-purple-700',
    'meja-5': 'bg-purple-100 text-purple-700',
    'selesai-tunggu1': 'bg-green-100 text-green-700',
    'selesai-tunggu2': 'bg-teal-100 text-teal-700'
  };

  const statusLabels = {
    'daftar': 'Terdaftar',
    'tunggu1': 'Menunggu 1',
    'tunggu2': 'Menunggu 2',
    'test': 'Antri Test',
    'meja-1': '🎯 Sedang Test',
    'meja-2': '🎯 Sedang Test',
    'meja-3': '🎯 Sedang Test',
    'meja-4': '🎯 Sedang Test',
    'meja-5': '🎯 Sedang Test',
    'selesai-tunggu1': '✅ Selesai (T1)',
    'selesai-tunggu2': '✅ Selesai (T2)'
  };

  // Icon gender
  const genderIcon = student.jenis_kelamin === 'Perempuan' ? '👧' : '👦';
  const genderColor = student.jenis_kelamin === 'Perempuan' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700';

  // Test completion badge with origin info and meja asal
  let testBadge = '';
  if (student.sudah_test === 1) {
    const originLabel = student.lokasi_asal === 'tunggu1' ? 'dari T1' : 'dari T2';
    const mejaLabel = student.meja_asal ? ` | Meja ${student.meja_asal.replace('meja-', '')}` : '';
    testBadge = `<span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">✅ ${originLabel}${mejaLabel}</span>`;
  }

  // Tentukan lokasi siswa (HARUS DIDEFINISIKAN DULU sebelum digunakan)
  const isInDaftar = student.lokasi === 'daftar';
  const isInTestPool = student.lokasi === 'test';
  const isAtTable = student.lokasi.startsWith('meja-');
  const isInWaitingRoom = student.lokasi === 'tunggu1' || student.lokasi === 'tunggu2';
  const isCompleted = student.lokasi === 'selesai-tunggu1' || student.lokasi === 'selesai-tunggu2';

  // Timer badge for students at test tables
  let timerBadge = '';
  if (student.lokasi.startsWith('meja-') && student.test_start_time) {
    const duration = calculateDuration(student.test_start_time);
    timerBadge = `<span class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 timer-badge" data-start="${student.test_start_time}">⏱️ ${duration}</span>`;
  }
  
  // Auto-move countdown badge for students in waiting rooms
  let autoMoveBadge = '';
  if (isInWaitingRoom && student.sudah_test !== 1) {
    const entryTime = student.lokasi === 'tunggu1' ? student.tunggu1_entry_time : student.tunggu2_entry_time;
    if (entryTime) {
      const now = new Date();
      const elapsed = Math.floor((now - new Date(entryTime)) / 1000);
      const remaining = Math.max(0, 10 - elapsed); // 10 seconds delay
      
      // Check if Pool Test is full
      const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
      const isPoolFull = poolTestCount >= 5; // POOL_TEST_CAPACITY
      
      if (remaining > 0) {
        if (isPoolFull) {
          autoMoveBadge = `<span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold auto-timer" data-id="${student.id}">⏸️ Pool Penuh (${remaining}s)</span>`;
        } else {
          autoMoveBadge = `<span class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold auto-timer" data-id="${student.id}">⏱️ Auto ${remaining}s</span>`;
        }
      } else {
        if (isPoolFull) {
          autoMoveBadge = `<span class="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold auto-timer" data-id="${student.id}">⏸️ Pool Penuh</span>`;
        } else {
          autoMoveBadge = `<span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold auto-timer" data-id="${student.id}">✓ Siap Pool</span>`;
        }
      }
    }
  }
  
  // Queue number badge for students in waiting rooms and pool test
  let queueBadge = '';
  if (isInWaitingRoom) {
    // Queue for Tunggu 1
    if (student.lokasi === 'tunggu1') {
      const tunggu1Students = studentsData
        .filter(s => s.lokasi === 'tunggu1')
        .sort((a, b) => {
          const timeA = a.tunggu1_entry_time ? new Date(a.tunggu1_entry_time).getTime() : 0;
          const timeB = b.tunggu1_entry_time ? new Date(b.tunggu1_entry_time).getTime() : 0;
          return timeA - timeB;
        });
      
      const queuePosition = tunggu1Students.findIndex(s => s.id === student.id) + 1;
      queueBadge = `<span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">📋 Antrian ${queuePosition}</span>`;
    }
    
    // Queue for Tunggu 2
    if (student.lokasi === 'tunggu2') {
      const tunggu2Students = studentsData
        .filter(s => s.lokasi === 'tunggu2')
        .sort((a, b) => {
          const timeA = a.tunggu2_entry_time ? new Date(a.tunggu2_entry_time).getTime() : 0;
          const timeB = b.tunggu2_entry_time ? new Date(b.tunggu2_entry_time).getTime() : 0;
          return timeA - timeB;
        });
      
      const queuePosition = tunggu2Students.findIndex(s => s.id === student.id) + 1;
      queueBadge = `<span class="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">📋 Antrian ${queuePosition}</span>`;
    }
  } else if (isInTestPool) {
    // Queue for Pool Test (INDEPENDENT dari Tunggu 1/2)
    const poolStudents = studentsData
      .filter(s => s.lokasi === 'test')
      .sort((a, b) => {
        const timeA = a.pool_entry_time ? new Date(a.pool_entry_time).getTime() : 0;
        const timeB = b.pool_entry_time ? new Date(b.pool_entry_time).getTime() : 0;
        return timeA - timeB;
      });
    
    const queuePosition = poolStudents.findIndex(s => s.id === student.id) + 1;
    const queueColor = queuePosition === 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
    const queueIcon = queuePosition === 1 ? '🎯' : '⏳';
    queueBadge = `<span class="text-xs px-2 py-0.5 rounded ${queueColor} font-bold">${queueIcon} Antrian ${queuePosition}</span>`;
  }
  
  // Badge for students waiting to be picked up (sudah di-plot oleh koordinator)
  let waitingPickupBadge = '';
  if (isInTestPool && student.plot_meja) {
    const mejaNum = student.plot_meja.replace('meja-', '');
    waitingPickupBadge = `<span class="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold animate-pulse">🚶 Diantar ke M${mejaNum}</span>`;
  }
  
  const buttonIcon = isInDaftar ? '✕' : '↩';
  const buttonTitle = isInDaftar ? 'Hapus siswa (klik 2x)' : 'Kembalikan ke Daftar Siswa';
  const buttonColor = isInDaftar ? 'hover:text-red-500 hover:bg-red-50' : 'hover:text-emerald-500 hover:bg-emerald-50';
  
  // Mobile action buttons
  let mobileButtons = '';
  if (isMobile) {
    // For Daftar Siswa - show move to waiting rooms
    if (isInDaftar && (currentUser.role === 'ADMIN' || currentUser.role === 'POS_RUANG')) {
      mobileButtons = `
        <div class="mt-2 flex gap-2">
          <button class="mobile-move-btn flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 px-2 rounded transition-colors font-medium" data-id="${student.id}" data-to="tunggu1">→ Tunggu 1</button>
          <button class="mobile-move-btn flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 px-2 rounded transition-colors font-medium" data-id="${student.id}" data-to="tunggu2">→ Tunggu 2</button>
        </div>
      `;
    }
    
    // For Waiting Rooms - show auto-move info with manual override
    if (isInWaitingRoom && (currentUser.role === 'ADMIN' || currentUser.role === 'POS_WAWANCARA')) {
      // Check if Pool Test is full
      const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
      const isPoolFull = poolTestCount >= 5; // POOL_TEST_CAPACITY
      
      if (isPoolFull) {
        mobileButtons = `
          <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p class="text-xs text-red-700 font-medium">⏸️ Pool Test Penuh (${poolTestCount}/5)</p>
            <p class="text-xs text-red-600 mt-1">Tunggu meja kosong...</p>
          </div>
        `;
      } else {
        mobileButtons = `
          <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
            <p class="text-xs text-blue-700 font-medium">⏱️ Auto ke Pool dalam <span class="auto-timer font-bold" data-id="${student.id}">-</span></p>
            <p class="text-xs text-blue-600">Pool: ${poolTestCount}/5 siswa</p>
            <button class="mobile-move-btn w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1.5 px-2 rounded transition-colors font-medium mt-1" data-id="${student.id}" data-to="test">→ Pindah Sekarang</button>
          </div>
        `;
      }
    }
  }
  
  // Show "Ploting ke Meja" buttons for KOORDINATOR_RUANG_TEST when student is in test pool
  let claimButtons = '';
  if (isInTestPool && currentUser && currentUser.role === 'KOORDINATOR_RUANG_TEST') {
    // Get queue position
    const poolStudents = studentsData
      .filter(s => s.lokasi === 'test')
      .sort((a, b) => {
        const timeA = a.pool_entry_time ? new Date(a.pool_entry_time).getTime() : 0;
        const timeB = b.pool_entry_time ? new Date(b.pool_entry_time).getTime() : 0;
        return timeA - timeB;
      });
    
    const queuePosition = poolStudents.findIndex(s => s.id === student.id) + 1;
    const isInTop5 = queuePosition <= 5; // Top 5 siswa bisa di-ploting
    
    if (isInTop5) {
      // Check which tables are occupied
      const table1Occupied = studentsData.some(s => s.lokasi === 'meja-1');
      const table2Occupied = studentsData.some(s => s.lokasi === 'meja-2');
      const table3Occupied = studentsData.some(s => s.lokasi === 'meja-3');
      const table4Occupied = studentsData.some(s => s.lokasi === 'meja-4');
      const table5Occupied = studentsData.some(s => s.lokasi === 'meja-5');
      
      // Check which tables are on break
      const table1Break = teachersData.some(t => t.meja_number === 1 && t.is_break === 1);
      const table2Break = teachersData.some(t => t.meja_number === 2 && t.is_break === 1);
      const table3Break = teachersData.some(t => t.meja_number === 3 && t.is_break === 1);
      const table4Break = teachersData.some(t => t.meja_number === 4 && t.is_break === 1);
      const table5Break = teachersData.some(t => t.meja_number === 5 && t.is_break === 1);
      
      // Count available tables (not occupied AND not on break)
      const availableTables = [
        !table1Occupied && !table1Break,
        !table2Occupied && !table2Break,
        !table3Occupied && !table3Break,
        !table4Occupied && !table4Break,
        !table5Occupied && !table5Break
      ].filter(Boolean).length;
      
      // Generate buttons (disabled if table occupied OR on break)
      const btn1 = table1Occupied 
        ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 1 terisi">M1</button>`
        : table1Break
        ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 1 istirahat">🛑</button>`
        : `<button class="claim-btn bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="1">M1</button>`;
      
      const btn2 = table2Occupied 
        ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 2 terisi">M2</button>`
        : table2Break
        ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 2 istirahat">🛑</button>`
        : `<button class="claim-btn bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="2">M2</button>`;
      
      const btn3 = table3Occupied 
        ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 3 terisi">M3</button>`
        : table3Break
        ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 3 istirahat">🛑</button>`
        : `<button class="claim-btn bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="3">M3</button>`;
      
      const btn4 = table4Occupied 
        ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 4 terisi">M4</button>`
        : table4Break
        ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 4 istirahat">🛑</button>`
        : `<button class="claim-btn bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="4">M4</button>`;
      
      const btn5 = table5Occupied 
        ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 5 terisi">M5</button>`
        : table5Break
        ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 5 istirahat">🛑</button>`
        : `<button class="claim-btn bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="5">M5</button>`;
      
      if (availableTables > 0) {
        // Show buttons for all 5 tables (disabled if occupied or on break)
        claimButtons = `
          <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded">
            <p class="text-xs text-green-700 font-semibold mb-1">🔔 PLOTING SISWA INI!</p>
            <p class="text-xs text-green-600 mb-2">Antrian ${queuePosition} - Pilih meja aktif (${availableTables}/5):</p>
            <div class="grid grid-cols-5 gap-1">
              ${btn1}
              ${btn2}
              ${btn3}
              ${btn4}
              ${btn5}
            </div>
          </div>
        `;
      } else {
        // All tables occupied or on break
        const breakCount = [table1Break, table2Break, table3Break, table4Break, table5Break].filter(Boolean).length;
        const occupiedCount = [table1Occupied, table2Occupied, table3Occupied, table4Occupied, table5Occupied].filter(Boolean).length;
        
        let statusMessage = '';
        if (breakCount > 0 && occupiedCount > 0) {
          statusMessage = `${occupiedCount} meja terisi, ${breakCount} meja istirahat`;
        } else if (breakCount > 0) {
          statusMessage = `${breakCount} meja sedang istirahat`;
        } else {
          statusMessage = 'Semua meja terisi';
        }
        
        claimButtons = `
          <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p class="text-xs text-red-700 font-semibold">⏸️ Tidak Ada Meja Tersedia</p>
            <p class="text-xs text-red-600 mt-1">${statusMessage}</p>
          </div>
        `;
      }
    } else {
      claimButtons = `
        <div class="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
          <p class="text-xs text-amber-700 font-semibold">⏳ Antrian ke-${queuePosition}</p>
          <p class="text-xs text-amber-600 mt-1">Tunggu 5 siswa pertama di-ploting dulu</p>
        </div>
      `;
    }
  }
  
  // Show "Jemput & Antar" buttons for PETUGAS_ANTAR when student is in test pool
  let escortButtons = '';
  if (isInTestPool && currentUser && currentUser.role === 'PETUGAS_ANTAR') {
    // Check if student is already plotted by coordinator
    if (student.plot_meja) {
      // Student already plotted - show single button to escort to assigned table
      const mejaNum = student.plot_meja.replace('meja-', '');
      
      // Check if target table is occupied
      const targetOccupied = studentsData.some(s => s.lokasi === student.plot_meja);
      
      // Check if target table is on break
      const targetBreak = teachersData.some(t => t.meja_number === parseInt(mejaNum) && t.is_break === 1);
      
      if (targetOccupied) {
        escortButtons = `
          <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p class="text-xs text-red-700 font-semibold">⚠️ Meja ${mejaNum} Terisi!</p>
            <p class="text-xs text-red-600 mt-1">Tunggu meja kosong atau hubungi koordinator</p>
          </div>
        `;
      } else if (targetBreak) {
        escortButtons = `
          <div class="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
            <p class="text-xs text-amber-700 font-semibold">🛑 Meja ${mejaNum} Istirahat!</p>
            <p class="text-xs text-amber-600 mt-1">Hubungi koordinator untuk ganti meja</p>
          </div>
        `;
      } else {
        escortButtons = `
          <div class="mt-2 p-2 bg-cyan-50 border border-cyan-200 rounded">
            <p class="text-xs text-cyan-700 font-semibold mb-1">🚶 JEMPUT & ANTAR!</p>
            <p class="text-xs text-cyan-600 mb-2">Sudah di-plot ke Meja ${mejaNum}</p>
            <button class="escort-btn w-full bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-1.5 px-2 rounded transition-colors font-medium" data-id="${student.id}" data-table="${mejaNum}">✓ Jemput & Antar ke M${mejaNum}</button>
          </div>
        `;
      }
    } else {
      // Student not yet plotted - show all available tables
      // Get queue position
      const poolStudents = studentsData
        .filter(s => s.lokasi === 'test')
        .sort((a, b) => {
          const timeA = a.pool_entry_time ? new Date(a.pool_entry_time).getTime() : 0;
          const timeB = b.pool_entry_time ? new Date(b.pool_entry_time).getTime() : 0;
          return timeA - timeB;
        });
      
      const queuePosition = poolStudents.findIndex(s => s.id === student.id) + 1;
      const isInTop5 = queuePosition <= 5; // Top 5 siswa bisa dijemput
      
      if (isInTop5) {
        // Check which tables are occupied
        const table1Occupied = studentsData.some(s => s.lokasi === 'meja-1');
        const table2Occupied = studentsData.some(s => s.lokasi === 'meja-2');
        const table3Occupied = studentsData.some(s => s.lokasi === 'meja-3');
        const table4Occupied = studentsData.some(s => s.lokasi === 'meja-4');
        const table5Occupied = studentsData.some(s => s.lokasi === 'meja-5');
        
        // Check which tables are on break
        const table1Break = teachersData.some(t => t.meja_number === 1 && t.is_break === 1);
        const table2Break = teachersData.some(t => t.meja_number === 2 && t.is_break === 1);
        const table3Break = teachersData.some(t => t.meja_number === 3 && t.is_break === 1);
        const table4Break = teachersData.some(t => t.meja_number === 4 && t.is_break === 1);
        const table5Break = teachersData.some(t => t.meja_number === 5 && t.is_break === 1);
        
        // Count available tables (not occupied AND not on break)
        const availableTables = [
          !table1Occupied && !table1Break,
          !table2Occupied && !table2Break,
          !table3Occupied && !table3Break,
          !table4Occupied && !table4Break,
          !table5Occupied && !table5Break
        ].filter(Boolean).length;
        
        // Generate buttons (disabled if table occupied OR on break)
        const btn1 = table1Occupied 
          ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 1 terisi">M1</button>`
          : table1Break
          ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 1 istirahat">🛑</button>`
          : `<button class="escort-btn bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="1">M1</button>`;
        
        const btn2 = table2Occupied 
          ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 2 terisi">M2</button>`
          : table2Break
          ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 2 istirahat">🛑</button>`
          : `<button class="escort-btn bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="2">M2</button>`;
        
        const btn3 = table3Occupied 
          ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 3 terisi">M3</button>`
          : table3Break
          ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 3 istirahat">🛑</button>`
          : `<button class="escort-btn bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="3">M3</button>`;
        
        const btn4 = table4Occupied 
          ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 4 terisi">M4</button>`
          : table4Break
          ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 4 istirahat">🛑</button>`
          : `<button class="escort-btn bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="4">M4</button>`;
        
        const btn5 = table5Occupied 
          ? `<button class="bg-slate-300 text-slate-500 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 5 terisi">M5</button>`
          : table5Break
          ? `<button class="bg-amber-300 text-amber-700 text-xs py-1 px-1 rounded cursor-not-allowed font-medium" disabled title="Meja 5 istirahat">🛑</button>`
          : `<button class="escort-btn bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-1 px-1 rounded transition-colors font-medium" data-id="${student.id}" data-table="5">M5</button>`;
        
        if (availableTables > 0) {
          // Show buttons for all 5 tables (disabled if occupied or on break)
          escortButtons = `
            <div class="mt-2 p-2 bg-cyan-50 border border-cyan-200 rounded">
              <p class="text-xs text-cyan-700 font-semibold mb-1">🚶 JEMPUT & ANTAR SISWA!</p>
              <p class="text-xs text-cyan-600 mb-2">Antrian ${queuePosition} - Pilih meja tujuan (${availableTables}/5):</p>
              <div class="grid grid-cols-5 gap-1">
                ${btn1}
                ${btn2}
                ${btn3}
                ${btn4}
                ${btn5}
              </div>
            </div>
          `;
        } else {
          // All tables occupied or on break
          const breakCount = [table1Break, table2Break, table3Break, table4Break, table5Break].filter(Boolean).length;
          const occupiedCount = [table1Occupied, table2Occupied, table3Occupied, table4Occupied, table5Occupied].filter(Boolean).length;
          
          let statusMessage = '';
          if (breakCount > 0 && occupiedCount > 0) {
            statusMessage = `${occupiedCount} meja terisi, ${breakCount} meja istirahat`;
          } else if (breakCount > 0) {
            statusMessage = `${breakCount} meja sedang istirahat`;
          } else {
            statusMessage = 'Semua meja terisi';
          }
          
          escortButtons = `
            <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p class="text-xs text-red-700 font-semibold">⏸️ Tidak Ada Meja Tersedia</p>
              <p class="text-xs text-red-600 mt-1">${statusMessage}</p>
            </div>
          `;
        }
      } else {
        escortButtons = `
          <div class="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
            <p class="text-xs text-amber-700 font-semibold">⏳ Antrian ke-${queuePosition}</p>
            <p class="text-xs text-amber-600 mt-1">Tunggu 5 siswa pertama dijemput dulu</p>
          </div>
        `;
      }
    }
  }
  
  // Show "Antar Kembali" button for PETUGAS_ANTAR when student finished test
  let returnButton = '';
  if (isAtTable && student.sudah_test === 1 && currentUser && currentUser.role === 'PETUGAS_ANTAR') {
    const returnLocation = student.lokasi_asal === 'tunggu1' ? 'Selesai Test (T1)' : 'Selesai Test (T2)';
    returnButton = `
      <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded">
        <p class="text-xs text-green-700 font-semibold mb-1">🚶 ANTAR KEMBALI</p>
        <p class="text-xs text-green-600 mb-2">Ke: ${returnLocation}</p>
        <button class="return-btn w-full bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 px-2 rounded transition-colors font-medium" data-id="${student.id}">✓ Antar Kembali</button>
      </div>
    `;
  }
  
  // Show "Selesai Test" button for students at table (only for PENGUJI and KOORDINATOR)
  let completeButton = '';
  if (isAtTable && student.sudah_test !== 1 && currentUser) {
    // Only PENGUJI_MEJA_1-5 and KOORDINATOR_RUANG_TEST can mark test as complete
    const isPenguji = currentUser.role.startsWith('PENGUJI_MEJA_');
    const isKoordinator = currentUser.role === 'KOORDINATOR_RUANG_TEST';
    
    if (isPenguji || isKoordinator) {
      completeButton = `<button class="complete-test-btn mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 px-2 rounded transition-colors font-medium" data-id="${student.id}">✓ Selesai Test</button>`;
    }
  }

  card.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">#${student.no_pendaftaran}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">Sesi ${(student.sesi || 'sesi1').replace('sesi', '')}</span>
          <span class="text-xs px-2 py-0.5 rounded ${genderColor}">${genderIcon} ${student.jenis_kelamin}</span>
          <span class="text-xs px-2 py-0.5 rounded ${statusColors[student.lokasi] || statusColors['daftar']}">${statusLabels[student.lokasi] || 'Terdaftar'}</span>
          ${queueBadge}
          ${waitingPickupBadge}
          ${testBadge}
          ${timerBadge}
          ${autoMoveBadge}
        </div>
        <p class="font-semibold text-slate-800 text-sm truncate">${student.nama_murid}</p>
        <p class="text-xs text-slate-500 truncate">👨‍👩‍👧 ${student.nama_orang_tua || '-'}</p>
        ${mobileButtons}
        ${claimButtons}
        ${escortButtons}
        ${completeButton}
        ${returnButton}
      </div>
      <button class="delete-btn text-slate-400 ${buttonColor} p-1 rounded transition-colors text-lg" data-id="${student.id}" title="${buttonTitle}">${buttonIcon}</button>
    </div>
  `;

  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDelete(student);
  });

  // Add event listeners for mobile move buttons
  const moveBtns = card.querySelectorAll('.mobile-move-btn');
  moveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const studentId = btn.getAttribute('data-id');
      const targetLocation = btn.getAttribute('data-to');
      moveStudent(studentId, targetLocation);
    });
  });

  // Add event listener for claim button (Koordinator - Ploting Langsung)
  const claimBtns = card.querySelectorAll('.claim-btn');
  claimBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tableNum = btn.getAttribute('data-table');
      plotingStudent(student, tableNum);
    });
  });

  // Add event listener for escort button (Petugas Antar - Jemput & Antar)
  const escortBtns = card.querySelectorAll('.escort-btn');
  escortBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tableNum = btn.getAttribute('data-table');
      escortStudent(student, tableNum);
    });
  });

  // Add event listener for complete test button (Penguji)
  const completeBtn = card.querySelector('.complete-test-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      completeTest(student);
    });
  }

  // Add event listener for return button (Petugas Antar - Antar Kembali)
  const returnBtn = card.querySelector('.return-btn');
  if (returnBtn) {
    returnBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      returnStudent(student);
    });
  }

  return card;
}

function handleDragStart(e) {
  draggedElement = e.target.closest('.student-card');
  draggedStudentId = draggedElement.getAttribute('data-id');
  draggedElement.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  
  // Store current location for potential return after test
  const student = studentsData.find(s => s.id == draggedStudentId);
  if (student) {
    draggedElement.setAttribute('data-from-location', student.lokasi);
  }
}

function handleDragEnd(e) {
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
  }
  draggedElement = null;
  draggedStudentId = null;
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });
}

function setupDropZones() {
  // Skip drop zone setup on mobile
  if (isMobile) return;
  
  const dropZones = document.querySelectorAll('.drop-zone');
  
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', (e) => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', async (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');

      if (draggedStudentId) {
        const newLocation = zone.getAttribute('data-location');
        const student = studentsData.find(s => s.id == draggedStudentId);
        const fromLocation = draggedElement.getAttribute('data-from-location');
        
        if (student && student.lokasi !== newLocation) {
          // Check Ruang Tunggu 1 capacity before moving
          if (newLocation === 'tunggu1') {
            const tunggu1Count = studentsData.filter(s => s.lokasi === 'tunggu1').length;
            if (tunggu1Count >= RUANG_TUNGGU_CAPACITY) {
              showMessage(`Ruang Tunggu 1 sudah penuh (${tunggu1Count}/${RUANG_TUNGGU_CAPACITY})! Tidak bisa menambah siswa.`, 'error');
              return;
            }
          }
          
          // Check Ruang Tunggu 2 capacity before moving
          if (newLocation === 'tunggu2') {
            const tunggu2Count = studentsData.filter(s => s.lokasi === 'tunggu2').length;
            if (tunggu2Count >= RUANG_TUNGGU_CAPACITY) {
              showMessage(`Ruang Tunggu 2 sudah penuh (${tunggu2Count}/${RUANG_TUNGGU_CAPACITY})! Tidak bisa menambah siswa.`, 'error');
              return;
            }
          }
          
          // Check Pool Test capacity before moving
          if (newLocation === 'test') {
            const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
            if (poolTestCount >= 5) { // POOL_TEST_CAPACITY
              showMessage(`Pool Test sudah penuh (${poolTestCount}/5)! Tunggu meja kosong terlebih dahulu.`, 'error');
              return;
            }
          }
          
          try {
            const updateData = { id: student.id, lokasi: newLocation };
            
            // If moving to test room, save the origin location
            if (newLocation === 'test' && fromLocation !== 'test') {
              updateData.lokasi_asal = fromLocation;
              updateData.pool_entry_time = new Date().toISOString();
            }
            
            await fetch(API_URL, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateData)
            });
            await loadStudents();
          } catch (error) {
            showMessage('Gagal memindahkan siswa', 'error');
          }
        }
      }
    });
  });
}

let deleteConfirmId = null;

function handleDelete(student) {
  // Jika siswa sudah di "daftar", hapus permanen (perlu konfirmasi 2x klik)
  if (student.lokasi === 'daftar') {
    if (deleteConfirmId === student.id) {
      confirmDelete(student);
    } else {
      deleteConfirmId = student.id;
      showMessage(`Klik sekali lagi untuk menghapus ${student.nama_murid} secara permanen`, 'warning');
      setTimeout(() => {
        deleteConfirmId = null;
      }, 3000);
    }
  } else {
    // Jika siswa di ruang lain, kembalikan ke "daftar"
    returnToDaftar(student);
  }
}

async function returnToDaftar(student) {
  try {
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: student.id, lokasi: 'daftar' })
    });
    showMessage(`${student.nama_murid} dikembalikan ke Daftar Siswa`, 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal mengembalikan siswa', 'error');
  }
}

async function confirmDelete(student) {
  try {
    await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: student.id })
    });
    showMessage('Siswa berhasil dihapus permanen', 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal menghapus siswa', 'error');
  }
  deleteConfirmId = null;
}

async function completeTest(student) {
  try {
    // Mark as completed and set status to wait for pickup
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: student.id,
        sudah_test: 1,
        test_end_time: new Date().toISOString(),
        status_antar: 'menunggu-jemput'
      })
    });
    
    showMessage(`${student.nama_murid} telah selesai test. Menunggu Petugas Antar untuk diantar kembali.`, 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal menyelesaikan test', 'error');
  }
}

async function plotingStudent(student, tableNum) {
  try {
    // Check if table already has a student
    const tableStudents = studentsData.filter(s => s.lokasi === `meja-${tableNum}`);
    if (tableStudents.length >= 1) {
      showMessage(`Meja ${tableNum} sudah terisi! Selesaikan test siswa saat ini terlebih dahulu.`, 'error');
      return;
    }
    
    // Check if table is on break
    const tableTeachers = teachersData.filter(t => t.meja_number === parseInt(tableNum));
    const isOnBreak = tableTeachers.some(t => t.is_break === 1);
    
    if (isOnBreak) {
      showMessage(`Meja ${tableNum} sedang istirahat! Pilih meja lain yang aktif.`, 'error');
      return;
    }
    
    // Koordinator: Plot siswa - TANDAI untuk dijemput oleh Petugas Antar
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: student.id,
        plot_meja: `meja-${tableNum}`,
        status_antar: 'menunggu-antar'
        // Siswa tetap di lokasi 'test' (pool test)
      })
    });
    
    showMessage(`${student.nama_murid} telah di-plot ke Meja ${tableNum}. Menunggu Petugas Antar untuk menjemput.`, 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal plot siswa', 'error');
  }
}

async function escortStudent(student, tableNum) {
  try {
    // Check if table already has a student
    const tableStudents = studentsData.filter(s => s.lokasi === `meja-${tableNum}`);
    if (tableStudents.length >= 1) {
      showMessage(`Meja ${tableNum} sudah terisi! Selesaikan test siswa saat ini terlebih dahulu.`, 'error');
      return;
    }
    
    // Check if table is on break
    const tableTeachers = teachersData.filter(t => t.meja_number === parseInt(tableNum));
    const isOnBreak = tableTeachers.some(t => t.is_break === 1);
    
    if (isOnBreak) {
      showMessage(`Meja ${tableNum} sedang istirahat! Pilih meja lain yang aktif.`, 'error');
      return;
    }
    
    // Petugas Antar: Jemput siswa dari Pool dan antar ke Meja
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: student.id,
        lokasi: `meja-${tableNum}`,
        meja_asal: `meja-${tableNum}`, // Save meja asal
        plot_meja: null,
        status_antar: null,
        test_start_time: new Date().toISOString()
      })
    });
    
    showMessage(`${student.nama_murid} berhasil dijemput dan diantar ke Meja ${tableNum}`, 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal mengantar siswa', 'error');
  }
}

async function returnStudent(student) {
  try {
    // Determine where to return the student based on their origin
    const lokasiAsal = student.lokasi_asal || 'tunggu1';
    const returnLocation = lokasiAsal === 'tunggu1' ? 'selesai-tunggu1' : 'selesai-tunggu2';
    
    // Petugas Antar: Antar kembali siswa ke Ruang Selesai
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: student.id,
        lokasi: returnLocation,
        status_antar: null
      })
    });
    
    const roomName = lokasiAsal === 'tunggu1' ? 'Selesai Test (Tunggu 1)' : 'Selesai Test (Tunggu 2)';
    showMessage(`${student.nama_murid} berhasil diantar kembali ke ${roomName}`, 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal mengantar kembali siswa', 'error');
  }
}

async function claimStudent(student, tableNum) {
  // Legacy function - kept for backward compatibility
  await plotingStudent(student, tableNum);
}

async function moveStudent(studentId, targetLocation) {
  try {
    const student = studentsData.find(s => s.id == studentId);
    if (!student) return;
    
    // Check Ruang Tunggu 1 capacity before moving
    if (targetLocation === 'tunggu1') {
      const tunggu1Count = studentsData.filter(s => s.lokasi === 'tunggu1').length;
      if (tunggu1Count >= RUANG_TUNGGU_CAPACITY) {
        showMessage(`Ruang Tunggu 1 sudah penuh (${tunggu1Count}/${RUANG_TUNGGU_CAPACITY})! Tidak bisa menambah siswa.`, 'error');
        return;
      }
    }
    
    // Check Ruang Tunggu 2 capacity before moving
    if (targetLocation === 'tunggu2') {
      const tunggu2Count = studentsData.filter(s => s.lokasi === 'tunggu2').length;
      if (tunggu2Count >= RUANG_TUNGGU_CAPACITY) {
        showMessage(`Ruang Tunggu 2 sudah penuh (${tunggu2Count}/${RUANG_TUNGGU_CAPACITY})! Tidak bisa menambah siswa.`, 'error');
        return;
      }
    }
    
    // Check Pool Test capacity before moving
    if (targetLocation === 'test') {
      const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
      if (poolTestCount >= 5) { // POOL_TEST_CAPACITY
        showMessage(`Pool Test sudah penuh (${poolTestCount}/5)! Tunggu meja kosong terlebih dahulu.`, 'error');
        return;
      }
    }
    
    const updateData = { id: studentId, lokasi: targetLocation };
    
    // If moving to test room, save the origin location and set pool entry time
    if (targetLocation === 'test' && student.lokasi !== 'test') {
      updateData.lokasi_asal = student.lokasi;
      updateData.pool_entry_time = new Date().toISOString();
    }
    
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    const locationNames = {
      'tunggu1': 'Ruang Tunggu 1',
      'tunggu2': 'Ruang Tunggu 2',
      'test': 'Pool Test',
      'daftar': 'Daftar Siswa'
    };
    
    showMessage(`${student.nama_murid} dipindahkan ke ${locationNames[targetLocation]}`, 'success');
    await loadStudents();
  } catch (error) {
    showMessage('Gagal memindahkan siswa', 'error');
  }
}

function calculateDuration(startTime) {
  if (!startTime) return '0:00';
  
  const start = new Date(startTime);
  const now = new Date();
  const diff = Math.floor((now - start) / 1000); // seconds
  
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Auto-move configuration
const AUTO_MOVE_DELAY = 10; // seconds - students auto-move to Pool Test after this delay
const POOL_TEST_CAPACITY = 5; // maximum students in Pool Test (same as number of tables)
const RUANG_TUNGGU_CAPACITY = 18; // maximum students in each Ruang Tunggu (1 and 2)

// Check and auto-move students from Tunggu 1/2 to Pool Test
async function checkAutoMove() {
  const now = new Date();
  
  // Count current students in Pool Test
  const poolTestCount = studentsData.filter(s => s.lokasi === 'test').length;
  
  // If Pool Test is full, don't auto-move
  if (poolTestCount >= POOL_TEST_CAPACITY) {
    console.log(`Pool Test is full (${poolTestCount}/${POOL_TEST_CAPACITY}). Waiting for space...`);
    return;
  }
  
  // Calculate how many slots are available
  const availableSlots = POOL_TEST_CAPACITY - poolTestCount;
  
  // Get students ready to move (sorted by entry time - FIFO)
  const readyStudents = [];
  
  for (const student of studentsData) {
    // Only process students in waiting rooms who haven't been tested
    if ((student.lokasi === 'tunggu1' || student.lokasi === 'tunggu2') && student.sudah_test !== 1) {
      const entryTime = student.lokasi === 'tunggu1' ? student.tunggu1_entry_time : student.tunggu2_entry_time;
      
      if (entryTime) {
        const elapsed = Math.floor((now - new Date(entryTime)) / 1000); // seconds
        
        // Check if ready to move (elapsed >= delay)
        if (elapsed >= AUTO_MOVE_DELAY) {
          readyStudents.push({
            student: student,
            entryTime: new Date(entryTime).getTime()
          });
        }
      }
    }
  }
  
  // Sort by entry time (oldest first - FIFO across both waiting rooms)
  readyStudents.sort((a, b) => a.entryTime - b.entryTime);
  
  // Move only up to available slots
  const studentsToMove = readyStudents.slice(0, availableSlots);
  
  for (const item of studentsToMove) {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: item.student.id, 
          lokasi: 'test',
          lokasi_asal: item.student.lokasi,
          pool_entry_time: new Date().toISOString()
        })
      });
      console.log(`Auto-moved ${item.student.nama_murid} to Pool Test (${poolTestCount + 1}/${POOL_TEST_CAPACITY})`);
    } catch (error) {
      console.error('Auto-move failed:', error);
    }
  }
}

// Update timers and auto-move countdown every second
setInterval(() => {
  // Update test duration timers
  document.querySelectorAll('.timer-badge').forEach(badge => {
    const startTime = badge.getAttribute('data-start');
    if (startTime) {
      badge.textContent = `⏱️ ${calculateDuration(startTime)}`;
    }
  });
  
  // Update auto-move countdown timers
  document.querySelectorAll('.auto-timer').forEach(timer => {
    const studentId = timer.getAttribute('data-id');
    const student = studentsData.find(s => s.id == studentId);
    
    if (student && (student.lokasi === 'tunggu1' || student.lokasi === 'tunggu2')) {
      const entryTime = student.lokasi === 'tunggu1' ? student.tunggu1_entry_time : student.tunggu2_entry_time;
      
      if (entryTime) {
        const now = new Date();
        const elapsed = Math.floor((now - new Date(entryTime)) / 1000);
        const remaining = Math.max(0, AUTO_MOVE_DELAY - elapsed);
        
        if (remaining > 0) {
          timer.textContent = `${remaining}s`;
          timer.classList.remove('text-red-600');
          timer.classList.add('text-blue-700');
        } else {
          timer.textContent = 'Siap!';
          timer.classList.remove('text-blue-700');
          timer.classList.add('text-green-600', 'font-bold');
        }
      }
    }
  });
}, 1000);

// Check for auto-move every 2 seconds
setInterval(async () => {
  await checkAutoMove();
  await loadStudents();
}, 2000);

function renderAllRooms() {
  const rooms = {
    'daftar': document.getElementById('daftar-siswa'),
    'tunggu1': document.getElementById('ruang-tunggu-1'),
    'tunggu2': document.getElementById('ruang-tunggu-2'),
    'test': document.getElementById('ruang-test'),
    'meja-1': document.getElementById('meja-1'),
    'meja-2': document.getElementById('meja-2'),
    'meja-3': document.getElementById('meja-3'),
    'meja-4': document.getElementById('meja-4'),
    'meja-5': document.getElementById('meja-5'),
    'selesai-tunggu1': document.getElementById('selesai-tunggu1'),
    'selesai-tunggu2': document.getElementById('selesai-tunggu2')
  };

  Object.values(rooms).forEach(room => {
    if (room) {
      room.querySelectorAll('.student-card').forEach(card => card.remove());
    }
  });

  const grouped = {
    'daftar': [],
    'tunggu1': [],
    'tunggu2': [],
    'test': [],
    'meja-1': [],
    'meja-2': [],
    'meja-3': [],
    'meja-4': [],
    'meja-5': [],
    'selesai-tunggu1': [],
    'selesai-tunggu2': []
  };

  // Use filtered data if search is active
  const searchDaftarInput = document.getElementById('search-daftar');
  const isSearchDaftarActive = searchDaftarInput && searchDaftarInput.value.trim() !== '';
  
  const searchSelesai1Input = document.getElementById('search-selesai1');
  const isSearchSelesai1Active = searchSelesai1Input && searchSelesai1Input.value.trim() !== '';
  
  const searchSelesai2Input = document.getElementById('search-selesai2');
  const isSearchSelesai2Active = searchSelesai2Input && searchSelesai2Input.value.trim() !== '';
  
  studentsData.forEach(student => {
    const loc = student.lokasi || 'daftar';
    if (grouped[loc]) {
      // For 'daftar', apply session filter AND search filter
      if (loc === 'daftar') {
        // Check session filter - normalize sesi value for comparison
        const studentSesiNumber = (student.sesi || 'sesi1').replace('sesi', '');
        const sessionMatch = currentSessionFilter === 'all' || studentSesiNumber === currentSessionFilter;
        
        if (sessionMatch) {
          // Then check search filter
          if (isSearchDaftarActive) {
            if (filteredStudentsData.some(s => s.id === student.id)) {
              grouped[loc].push(student);
            }
          } else {
            grouped[loc].push(student);
          }
        }
      } 
      // For 'selesai-tunggu1', use filtered data if search is active
      else if (loc === 'selesai-tunggu1' && isSearchSelesai1Active) {
        if (filteredSelesai1Data.some(s => s.id === student.id)) {
          grouped[loc].push(student);
        }
      }
      // For 'selesai-tunggu2', use filtered data if search is active
      else if (loc === 'selesai-tunggu2' && isSearchSelesai2Active) {
        if (filteredSelesai2Data.some(s => s.id === student.id)) {
          grouped[loc].push(student);
        }
      }
      else {
        grouped[loc].push(student);
      }
    }
  });

  // CRITICAL: Sort by FIFO timestamps
  // Tunggu 1: Sort by tunggu1_entry_time
  if (grouped['tunggu1']) {
    grouped['tunggu1'].sort((a, b) => {
      const timeA = a.tunggu1_entry_time ? new Date(a.tunggu1_entry_time).getTime() : 0;
      const timeB = b.tunggu1_entry_time ? new Date(b.tunggu1_entry_time).getTime() : 0;
      return timeA - timeB; // Oldest first
    });
  }
  
  // Tunggu 2: Sort by tunggu2_entry_time
  if (grouped['tunggu2']) {
    grouped['tunggu2'].sort((a, b) => {
      const timeA = a.tunggu2_entry_time ? new Date(a.tunggu2_entry_time).getTime() : 0;
      const timeB = b.tunggu2_entry_time ? new Date(b.tunggu2_entry_time).getTime() : 0;
      return timeA - timeB; // Oldest first
    });
  }
  
  // Pool Test: Sort by pool_entry_time (INDEPENDENT dari Tunggu 1/2)
  if (grouped['test']) {
    grouped['test'].sort((a, b) => {
      const timeA = a.pool_entry_time ? new Date(a.pool_entry_time).getTime() : 0;
      const timeB = b.pool_entry_time ? new Date(b.pool_entry_time).getTime() : 0;
      return timeA - timeB; // Oldest first
    });
  }

  Object.entries(grouped).forEach(([location, students]) => {
    const room = rooms[location];
    if (!room) return;
    
    const emptyMsg = room.querySelector('.empty-message');
    
    if (students.length > 0) {
      if (emptyMsg) emptyMsg.style.display = 'none';
      students.forEach(student => {
        room.appendChild(createStudentCard(student));
      });
    } else {
      if (emptyMsg) {
        emptyMsg.style.display = 'block';
        // Update message for search results
        if (location === 'daftar' && isSearchDaftarActive) {
          emptyMsg.textContent = 'Tidak ada siswa yang cocok dengan pencarian';
        } else if (location === 'daftar' && currentSessionFilter !== 'all') {
          emptyMsg.textContent = `Tidak ada siswa di Sesi ${currentSessionFilter}`;
        } else {
          const messages = {
            'daftar': 'Belum ada siswa terdaftar',
            'tunggu1': 'Belum ada siswa menunggu',
            'tunggu2': 'Belum ada siswa menunggu',
            'test': 'Belum ada siswa di ruang test',
            'meja-1': 'Meja kosong - Ambil siswa dari Pool',
            'meja-2': 'Meja kosong - Ambil siswa dari Pool',
            'meja-3': 'Meja kosong - Ambil siswa dari Pool',
            'meja-4': 'Meja kosong - Ambil siswa dari Pool',
            'meja-5': 'Meja kosong - Ambil siswa dari Pool',
            'selesai-tunggu1': 'Belum ada siswa selesai test',
            'selesai-tunggu2': 'Belum ada siswa selesai test'
          };
          emptyMsg.textContent = messages[location] || 'Tidak ada data';
        }
      }
    }
  });
}

function updateStatistics() {
  const counts = {
    'daftar': 0,
    'tunggu1': 0,
    'tunggu2': 0,
    'test': 0,
    'meja-1': 0,
    'meja-2': 0,
    'meja-3': 0,
    'meja-4': 0,
    'meja-5': 0,
    'selesai-tunggu1': 0,
    'selesai-tunggu2': 0
  };

  let totalLaki = 0;
  let totalPerempuan = 0;

  studentsData.forEach(student => {
    const loc = student.lokasi || 'daftar';
    
    // For 'daftar', apply session filter
    if (loc === 'daftar') {
      const studentSesiNumber = (student.sesi || 'sesi1').replace('sesi', '');
      const sessionMatch = currentSessionFilter === 'all' || studentSesiNumber === currentSessionFilter;
      
      if (sessionMatch && counts[loc] !== undefined) {
        counts[loc]++;
      }
    } else {
      // For other locations, count normally
      if (counts[loc] !== undefined) {
        counts[loc]++;
      }
    }

    // Count by gender (only for filtered daftar or all other locations)
    if (loc === 'daftar') {
      const studentSesiNumber = (student.sesi || 'sesi1').replace('sesi', '');
      const sessionMatch = currentSessionFilter === 'all' || studentSesiNumber === currentSessionFilter;
      
      if (sessionMatch) {
        if (student.jenis_kelamin === 'Laki-laki') {
          totalLaki++;
        } else if (student.jenis_kelamin === 'Perempuan') {
          totalPerempuan++;
        }
      }
    } else {
      if (student.jenis_kelamin === 'Laki-laki') {
        totalLaki++;
      } else if (student.jenis_kelamin === 'Perempuan') {
        totalPerempuan++;
      }
    }
  });

  // Update location counts
  const statElements = {
    'stat-daftar': counts.daftar,
    'stat-tunggu1': counts.tunggu1,
    'stat-tunggu2': counts.tunggu2,
    'stat-test': counts.test,
    'stat-meja1': counts['meja-1'],
    'stat-meja2': counts['meja-2'],
    'stat-meja3': counts['meja-3'],
    'stat-meja4': counts['meja-4'],
    'stat-meja5': counts['meja-5'],
    'stat-selesai1': counts['selesai-tunggu1'],
    'stat-selesai2': counts['selesai-tunggu2']
  };

  Object.entries(statElements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  // Update total and gender counts
  document.getElementById('total-siswa').textContent = studentsData.length;
  document.getElementById('total-laki').textContent = totalLaki;
  document.getElementById('total-perempuan').textContent = totalPerempuan;
  
  // Update Pool Test capacity display
  const poolCapacityEl = document.getElementById('pool-capacity');
  if (poolCapacityEl) {
    poolCapacityEl.textContent = `${counts.test}/5`;
    // Change color based on capacity
    poolCapacityEl.classList.remove('bg-white/20', 'bg-green-500', 'bg-amber-500', 'bg-red-500');
    if (counts.test === 0) {
      poolCapacityEl.classList.add('bg-white/20');
    } else if (counts.test < 3) {
      poolCapacityEl.classList.add('bg-green-500');
    } else if (counts.test < 5) {
      poolCapacityEl.classList.add('bg-amber-500');
    } else {
      poolCapacityEl.classList.add('bg-red-500');
    }
  }
  
  // Update Ruang Tunggu 1 capacity display
  const tunggu1CapacityEl = document.getElementById('tunggu1-capacity');
  if (tunggu1CapacityEl) {
    tunggu1CapacityEl.textContent = `(${counts.tunggu1}/18)`;
    // Change color based on capacity
    if (counts.tunggu1 >= 18) {
      tunggu1CapacityEl.classList.add('text-red-200', 'font-bold');
    } else if (counts.tunggu1 >= 15) {
      tunggu1CapacityEl.classList.add('text-amber-200');
    } else {
      tunggu1CapacityEl.classList.remove('text-red-200', 'text-amber-200', 'font-bold');
    }
  }
  
  // Update Ruang Tunggu 2 capacity display
  const tunggu2CapacityEl = document.getElementById('tunggu2-capacity');
  if (tunggu2CapacityEl) {
    tunggu2CapacityEl.textContent = `(${counts.tunggu2}/18)`;
    // Change color based on capacity
    if (counts.tunggu2 >= 18) {
      tunggu2CapacityEl.classList.add('text-red-200', 'font-bold');
    } else if (counts.tunggu2 >= 15) {
      tunggu2CapacityEl.classList.add('text-amber-200');
    } else {
      tunggu2CapacityEl.classList.remove('text-red-200', 'text-amber-200', 'font-bold');
    }
  }
}

function showMessage(text, type) {
  const msgEl = document.getElementById('form-message');
  msgEl.textContent = text;
  msgEl.classList.remove('hidden', 'text-green-600', 'text-red-600', 'text-amber-600');
  
  if (type === 'success') msgEl.classList.add('text-green-600');
  else if (type === 'error') msgEl.classList.add('text-red-600');
  else if (type === 'warning') msgEl.classList.add('text-amber-600');
  
  setTimeout(() => {
    msgEl.classList.add('hidden');
  }, 3000);
}

document.getElementById('add-student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const noPendaftaran = document.getElementById('no_pendaftaran').value.trim();
  const namaMurid = document.getElementById('nama_murid').value.trim();
  const namaOrangTua = document.getElementById('nama_orang_tua').value.trim();

  if (!noPendaftaran || !namaMurid || !namaOrangTua) {
    showMessage('Semua field harus diisi', 'error');
    return;
  }

  const addBtn = document.getElementById('add-btn');
  addBtn.disabled = true;
  addBtn.innerHTML = '<span class="animate-pulse">⏳</span> Menyimpan...';

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        no_pendaftaran: noPendaftaran,
        nama_murid: namaMurid,
        nama_orang_tua: namaOrangTua,
        status: 'active',
        lokasi: 'daftar',
        created_at: new Date().toISOString()
      })
    });

    showMessage('Siswa berhasil ditambahkan!', 'success');
    document.getElementById('add-student-form').reset();
    await loadStudents();
  } catch (error) {
    showMessage('Gagal menambahkan siswa', 'error');
  }

  addBtn.disabled = false;
  addBtn.innerHTML = '<span>➕</span> Tambah Siswa';
});

document.getElementById('refresh-btn').addEventListener('click', () => {
  loadStudents();
});

// Search functionality for Daftar Siswa
const searchInput = document.getElementById('search-daftar');
const clearSearchBtn = document.getElementById('clear-search-daftar');
const searchResult = document.getElementById('search-result-daftar');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  
  if (searchTerm === '') {
    // Reset to show all students
    filteredStudentsData = [];
    clearSearchBtn.classList.add('hidden');
    searchResult.classList.add('hidden');
    renderAllRooms();
    updateStatistics();
    return;
  }
  
  // Show clear button
  clearSearchBtn.classList.remove('hidden');
  
  // Filter students in 'daftar' location
  filteredStudentsData = studentsData.filter(student => {
    if (student.lokasi !== 'daftar') return false;
    
    const matchName = student.nama_murid.toLowerCase().includes(searchTerm);
    const matchNo = student.no_pendaftaran.toLowerCase().includes(searchTerm);
    const matchParent = student.nama_orang_tua.toLowerCase().includes(searchTerm);
    
    return matchName || matchNo || matchParent;
  });
  
  // Show search result count
  searchResult.classList.remove('hidden');
  searchResult.textContent = `Ditemukan ${filteredStudentsData.length} siswa`;
  
  // Re-render rooms with filtered data
  renderAllRooms();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  filteredStudentsData = [];
  clearSearchBtn.classList.add('hidden');
  searchResult.classList.add('hidden');
  renderAllRooms();
  updateStatistics();
});

// Search functionality for Selesai Test (Tunggu 1)
const searchSelesai1Input = document.getElementById('search-selesai1');
const clearSearchSelesai1Btn = document.getElementById('clear-search-selesai1');
const searchResultSelesai1 = document.getElementById('search-result-selesai1');

searchSelesai1Input.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  
  if (searchTerm === '') {
    filteredSelesai1Data = [];
    clearSearchSelesai1Btn.classList.add('hidden');
    searchResultSelesai1.classList.add('hidden');
    renderAllRooms();
    return;
  }
  
  clearSearchSelesai1Btn.classList.remove('hidden');
  
  filteredSelesai1Data = studentsData.filter(student => {
    if (student.lokasi !== 'selesai-tunggu1') return false;
    
    const matchName = student.nama_murid.toLowerCase().includes(searchTerm);
    const matchNo = student.no_pendaftaran.toLowerCase().includes(searchTerm);
    const matchParent = student.nama_orang_tua.toLowerCase().includes(searchTerm);
    
    return matchName || matchNo || matchParent;
  });
  
  searchResultSelesai1.classList.remove('hidden');
  searchResultSelesai1.textContent = `Ditemukan ${filteredSelesai1Data.length} siswa`;
  
  renderAllRooms();
});

clearSearchSelesai1Btn.addEventListener('click', () => {
  searchSelesai1Input.value = '';
  filteredSelesai1Data = [];
  clearSearchSelesai1Btn.classList.add('hidden');
  searchResultSelesai1.classList.add('hidden');
  renderAllRooms();
});

// Search functionality for Selesai Test (Tunggu 2)
const searchSelesai2Input = document.getElementById('search-selesai2');
const clearSearchSelesai2Btn = document.getElementById('clear-search-selesai2');
const searchResultSelesai2 = document.getElementById('search-result-selesai2');

searchSelesai2Input.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  
  if (searchTerm === '') {
    filteredSelesai2Data = [];
    clearSearchSelesai2Btn.classList.add('hidden');
    searchResultSelesai2.classList.add('hidden');
    renderAllRooms();
    return;
  }
  
  clearSearchSelesai2Btn.classList.remove('hidden');
  
  filteredSelesai2Data = studentsData.filter(student => {
    if (student.lokasi !== 'selesai-tunggu2') return false;
    
    const matchName = student.nama_murid.toLowerCase().includes(searchTerm);
    const matchNo = student.no_pendaftaran.toLowerCase().includes(searchTerm);
    const matchParent = student.nama_orang_tua.toLowerCase().includes(searchTerm);
    
    return matchName || matchNo || matchParent;
  });
  
  searchResultSelesai2.classList.remove('hidden');
  searchResultSelesai2.textContent = `Ditemukan ${filteredSelesai2Data.length} siswa`;
  
  renderAllRooms();
});

clearSearchSelesai2Btn.addEventListener('click', () => {
  searchSelesai2Input.value = '';
  filteredSelesai2Data = [];
  clearSearchSelesai2Btn.classList.add('hidden');
  searchResultSelesai2.classList.add('hidden');
  renderAllRooms();
});

// Session filter event listener
const sessionFilterSelect = document.getElementById('session-filter');
if (sessionFilterSelect) {
  sessionFilterSelect.addEventListener('change', (e) => {
    currentSessionFilter = e.target.value;
    console.log('🔍 Filter sesi dipilih:', currentSessionFilter);
    
    // Debug: show how many students match
    const matchingStudents = studentsData.filter(s => {
      if (s.lokasi !== 'daftar') return false;
      const studentSesiNumber = (s.sesi || 'sesi1').replace('sesi', '');
      return currentSessionFilter === 'all' || studentSesiNumber === currentSessionFilter;
    });
    console.log('📊 Siswa yang cocok:', matchingStudents.length);
    console.log('📋 Sample data:', matchingStudents.slice(0, 3).map(s => ({
      nama: s.nama_murid,
      sesi: s.sesi,
      sesiNumber: (s.sesi || 'sesi1').replace('sesi', '')
    })));
    
    renderAllRooms();
    updateStatistics();
  });
}

setupDropZones();
loadStudents();
loadTeachers();
