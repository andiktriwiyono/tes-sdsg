// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
if (!currentUser.username) {
  window.location.href = '/login.html';
}

// API URLs - gunakan /api/* untuk semua environment
const API_URL = '/api/students';
const TEACHERS_API_URL = '/api/teachers';

let studentsData = [];
let teachersData = [];
let filteredData = [];

// Load data
async function loadData() {
  try {
    const [studentsResponse, teachersResponse] = await Promise.all([
      fetch(API_URL),
      fetch(TEACHERS_API_URL)
    ]);
    
    studentsData = await studentsResponse.json();
    teachersData = await teachersResponse.json();
    
    console.log('=== DATA LOADED ===');
    console.log('Total students:', studentsData.length);
    console.log('Sample student data:', studentsData[0]);
    
    // Debug: Check sesi values
    const sesiCounts = {};
    studentsData.forEach(s => {
      const sesi = s.sesi || 'undefined';
      sesiCounts[sesi] = (sesiCounts[sesi] || 0) + 1;
    });
    console.log('Sesi distribution:', sesiCounts);
    
    // Debug: Check sudah_test values
    const testStatus = {
      completed: studentsData.filter(s => s.sudah_test === 1).length,
      notCompleted: studentsData.filter(s => s.sudah_test !== 1).length
    };
    console.log('Test status:', testStatus);
    
    // Debug: Check gender values
    const genderCounts = {};
    studentsData.forEach(s => {
      const gender = s.jenis_kelamin || 'undefined';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });
    console.log('Gender distribution:', genderCounts);
    
    applyFilters();
    generateReports();
    updateTimestamp();
  } catch (error) {
    console.error('Error loading data:', error);
    alert('Error loading data. Please refresh the page.');
  }
}

// Apply filters
function applyFilters() {
  const sesiFilter = document.getElementById('filter-sesi').value;
  const genderFilter = document.getElementById('filter-gender').value;
  const statusFilter = document.getElementById('filter-status').value;
  
  console.log('=== APPLYING FILTERS ===');
  console.log('Filters:', { sesiFilter, genderFilter, statusFilter });
  console.log('Total students before filter:', studentsData.length);
  
  // If all filters are "all", just show all data
  if (sesiFilter === 'all' && genderFilter === 'all' && statusFilter === 'all') {
    filteredData = [...studentsData];
    console.log('All filters set to "all" - showing all students:', filteredData.length);
    return;
  }
  
  filteredData = studentsData.filter(student => {
    // Sesi filter - handle both string ('sesi1') and number (1) formats
    if (sesiFilter !== 'all') {
      let studentSesiNumber;
      
      if (typeof student.sesi === 'string') {
        // If sesi is string like 'sesi1', extract the number
        studentSesiNumber = student.sesi.replace('sesi', '');
      } else if (typeof student.sesi === 'number') {
        // If sesi is already a number, convert to string
        studentSesiNumber = String(student.sesi);
      } else {
        // Default to sesi 1
        studentSesiNumber = '1';
      }
      
      if (studentSesiNumber !== sesiFilter) {
        return false;
      }
    }
    
    // Gender filter
    if (genderFilter !== 'all') {
      if (student.jenis_kelamin !== genderFilter) {
        return false;
      }
    }
    
    // Status filter - check sudah_test field (0 or 1)
    if (statusFilter === 'completed') {
      if (student.sudah_test !== 1) {
        return false;
      }
    }
    if (statusFilter === 'not-completed') {
      // Check for 0, null, or undefined
      if (student.sudah_test === 1) {
        return false;
      }
    }
    
    return true;
  });
  
  console.log('Total students after filter:', filteredData.length);
  if (filteredData.length > 0) {
    console.log('Sample filtered student:', filteredData[0]);
  } else {
    console.log('NO STUDENTS MATCHED THE FILTER!');
    console.log('Debugging individual filters:');
    
    // Debug each filter separately
    if (sesiFilter !== 'all') {
      const sesiMatches = studentsData.filter(s => {
        let sn = typeof s.sesi === 'string' ? s.sesi.replace('sesi', '') : String(s.sesi || 1);
        return sn === sesiFilter;
      });
      console.log(`  Sesi ${sesiFilter}: ${sesiMatches.length} students`);
    }
    
    if (genderFilter !== 'all') {
      const genderMatches = studentsData.filter(s => s.jenis_kelamin === genderFilter);
      console.log(`  Gender ${genderFilter}: ${genderMatches.length} students`);
    }
    
    if (statusFilter !== 'all') {
      const statusMatches = studentsData.filter(s => {
        if (statusFilter === 'completed') return s.sudah_test === 1;
        if (statusFilter === 'not-completed') return s.sudah_test !== 1;
        return true;
      });
      console.log(`  Status ${statusFilter}: ${statusMatches.length} students`);
    }
    
    // Try combined filters step by step
    let tempFiltered = [...studentsData];
    if (sesiFilter !== 'all') {
      tempFiltered = tempFiltered.filter(s => {
        let sn = typeof s.sesi === 'string' ? s.sesi.replace('sesi', '') : String(s.sesi || 1);
        return sn === sesiFilter;
      });
      console.log(`  After sesi filter: ${tempFiltered.length} students`);
    }
    if (genderFilter !== 'all') {
      tempFiltered = tempFiltered.filter(s => s.jenis_kelamin === genderFilter);
      console.log(`  After gender filter: ${tempFiltered.length} students`);
    }
    if (statusFilter !== 'all') {
      tempFiltered = tempFiltered.filter(s => {
        if (statusFilter === 'completed') return s.sudah_test === 1;
        if (statusFilter === 'not-completed') return s.sudah_test !== 1;
        return true;
      });
      console.log(`  After status filter: ${tempFiltered.length} students`);
    }
  }
}

// Generate all reports
function generateReports() {
  generateSummaryStats();
  generateSesiReport();
  generateMejaReport();
  generateDurationReport();
  generateStudentsDetail();
}

// Summary statistics
function generateSummaryStats() {
  const total = filteredData.length;
  const completed = filteredData.filter(s => s.sudah_test === 1).length;
  const notCompleted = total - completed;
  
  // Calculate average duration
  const completedWithDuration = filteredData.filter(s => 
    s.sudah_test === 1 && s.test_start_time && s.test_end_time
  );
  
  let avgDuration = '-';
  if (completedWithDuration.length > 0) {
    const totalDuration = completedWithDuration.reduce((sum, s) => {
      const start = new Date(s.test_start_time);
      const end = new Date(s.test_end_time);
      return sum + (end - start);
    }, 0);
    
    const avgMs = totalDuration / completedWithDuration.length;
    avgDuration = formatDuration(avgMs);
  }
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-not-completed').textContent = notCompleted;
  document.getElementById('stat-avg-duration').textContent = avgDuration;
}

// Laporan per sesi
function generateSesiReport() {
  const container = document.getElementById('sesi-report');
  const sesiData = [
    { sesi: 1, range: '1-35' },
    { sesi: 2, range: '36-71' },
    { sesi: 3, range: '72-106' }
  ];
  
  container.innerHTML = sesiData.map(({ sesi, range }) => {
    const sesiStudents = filteredData.filter(s => {
      let studentSesiNumber;
      if (typeof s.sesi === 'string') {
        studentSesiNumber = s.sesi.replace('sesi', '');
      } else if (typeof s.sesi === 'number') {
        studentSesiNumber = String(s.sesi);
      } else {
        studentSesiNumber = '1';
      }
      return studentSesiNumber === String(sesi);
    });
    const completed = sesiStudents.filter(s => s.sudah_test === 1).length;
    const notCompleted = sesiStudents.length - completed;
    const percentage = sesiStudents.length > 0 
      ? Math.round((completed / sesiStudents.length) * 100) 
      : 0;
    
    return `
      <div class="border border-slate-200 rounded-lg p-4">
        <h3 class="font-bold text-slate-700 mb-2">Sesi ${sesi} (${range})</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-600">Total:</span>
            <span class="font-semibold">${sesiStudents.length} siswa</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Sudah Test:</span>
            <span class="font-semibold text-green-600">${completed}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Belum Test:</span>
            <span class="font-semibold text-amber-600">${notCompleted}</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-200">
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Progress:</span>
              <span class="font-bold text-indigo-600">${percentage}%</span>
            </div>
            <div class="mt-2 bg-slate-200 rounded-full h-2">
              <div class="bg-indigo-600 h-2 rounded-full transition-all" style="width: ${percentage}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Laporan per meja
function generateMejaReport() {
  const tbody = document.getElementById('meja-report');
  
  const mejaData = [];
  for (let i = 1; i <= 5; i++) {
    const mejaStudents = filteredData.filter(s => 
      s.meja_asal === `meja-${i}` && s.sudah_test === 1
    );
    
    // Get teachers for this meja
    const mejaTeachers = teachersData.filter(t => t.meja_number === i);
    const teacherNames = mejaTeachers.map(t => t.teacher_name).join(' & ') || 'Belum diatur';
    
    // Calculate average duration
    const studentsWithDuration = mejaStudents.filter(s => 
      s.test_start_time && s.test_end_time
    );
    
    let avgDuration = '-';
    if (studentsWithDuration.length > 0) {
      const totalDuration = studentsWithDuration.reduce((sum, s) => {
        const start = new Date(s.test_start_time);
        const end = new Date(s.test_end_time);
        return sum + (end - start);
      }, 0);
      
      const avgMs = totalDuration / studentsWithDuration.length;
      avgDuration = formatDuration(avgMs);
    }
    
    mejaData.push({
      meja: i,
      teachers: teacherNames,
      count: mejaStudents.length,
      avgDuration
    });
  }
  
  tbody.innerHTML = mejaData.map(data => `
    <tr class="hover:bg-slate-50">
      <td class="px-4 py-3 text-sm font-semibold text-slate-800">Meja ${data.meja}</td>
      <td class="px-4 py-3 text-sm text-slate-600">${data.teachers}</td>
      <td class="px-4 py-3 text-sm text-slate-800">${data.count} siswa</td>
      <td class="px-4 py-3 text-sm text-slate-800">${data.avgDuration}</td>
    </tr>
  `).join('');
}

// Laporan durasi test
function generateDurationReport() {
  const completedWithDuration = filteredData.filter(s => 
    s.sudah_test === 1 && s.test_start_time && s.test_end_time
  ).map(s => {
    const start = new Date(s.test_start_time);
    const end = new Date(s.test_end_time);
    const duration = end - start;
    return { ...s, duration };
  });
  
  // Sort by duration
  const fastest = [...completedWithDuration]
    .sort((a, b) => a.duration - b.duration)
    .slice(0, 5);
  
  const slowest = [...completedWithDuration]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);
  
  // Render fastest
  document.getElementById('fastest-students').innerHTML = fastest.length > 0
    ? fastest.map((s, i) => `
        <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold text-green-600">#${i + 1}</span>
            <div>
              <p class="font-semibold text-slate-800 text-sm">${s.nama_murid}</p>
              <p class="text-xs text-slate-500">No. ${s.no_pendaftaran} | Meja ${s.meja_asal?.replace('meja-', '') || '-'}</p>
            </div>
          </div>
          <span class="font-bold text-green-600">${formatDuration(s.duration)}</span>
        </div>
      `).join('')
    : '<p class="text-slate-400 text-sm">Belum ada data</p>';
  
  // Render slowest
  document.getElementById('slowest-students').innerHTML = slowest.length > 0
    ? slowest.map((s, i) => `
        <div class="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold text-amber-600">#${i + 1}</span>
            <div>
              <p class="font-semibold text-slate-800 text-sm">${s.nama_murid}</p>
              <p class="text-xs text-slate-500">No. ${s.no_pendaftaran} | Meja ${s.meja_asal?.replace('meja-', '') || '-'}</p>
            </div>
          </div>
          <span class="font-bold text-amber-600">${formatDuration(s.duration)}</span>
        </div>
      `).join('')
    : '<p class="text-slate-400 text-sm">Belum ada data</p>';
}

// Detail siswa
function generateStudentsDetail() {
  const tbody = document.getElementById('students-detail');
  
  if (filteredData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-8 text-center text-slate-500">
          <div class="flex flex-col items-center gap-2">
            <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="font-semibold">Tidak ada data siswa yang sesuai dengan filter</p>
            <p class="text-sm">Coba ubah filter atau pilih "Semua" untuk melihat semua data</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = filteredData.map((s, i) => {
    const statusBadge = s.sudah_test === 1
      ? '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">✓ Sudah</span>'
      : '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">⏳ Belum</span>';
    
    const genderIcon = s.jenis_kelamin === 'Perempuan' ? '👧' : '👦';
    
    const mejaText = s.meja_asal ? s.meja_asal.replace('meja-', '') : '-';
    
    // Normalize sesi display
    let sesiDisplay;
    if (typeof s.sesi === 'string') {
      sesiDisplay = s.sesi.replace('sesi', '');
    } else if (typeof s.sesi === 'number') {
      sesiDisplay = String(s.sesi);
    } else {
      sesiDisplay = '1';
    }
    
    let duration = '-';
    if (s.sudah_test === 1 && s.test_start_time && s.test_end_time) {
      const start = new Date(s.test_start_time);
      const end = new Date(s.test_end_time);
      duration = formatDuration(end - start);
    }
    
    return `
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 text-sm text-slate-600">${i + 1}</td>
        <td class="px-4 py-3 text-sm font-mono text-slate-800">${s.no_pendaftaran}</td>
        <td class="px-4 py-3 text-sm text-slate-800">${s.nama_murid}</td>
        <td class="px-4 py-3 text-sm text-slate-600">Sesi ${sesiDisplay}</td>
        <td class="px-4 py-3 text-sm">${genderIcon} ${s.jenis_kelamin}</td>
        <td class="px-4 py-3">${statusBadge}</td>
        <td class="px-4 py-3 text-sm text-slate-800">${mejaText}</td>
        <td class="px-4 py-3 text-sm font-semibold text-slate-800">${duration}</td>
      </tr>
    `;
  }).join('');
}

// Format duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

// Update timestamp
function updateTimestamp() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('id-ID');
  document.getElementById('report-timestamp').textContent = `Laporan dibuat: ${dateStr}, ${timeStr}`;
}

// Export to Excel
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  
  // Sheet 1: Summary
  const summaryData = [
    ['LAPORAN TEST - SD SUNANGIRI'],
    ['Tanggal:', new Date().toLocaleDateString('id-ID')],
    [''],
    ['RINGKASAN'],
    ['Total Siswa', filteredData.length],
    ['Sudah Test', filteredData.filter(s => s.sudah_test === 1).length],
    ['Belum Test', filteredData.filter(s => s.sudah_test !== 1).length],
    [''],
    ['BREAKDOWN PER SESI'],
    ['Sesi', 'Total', 'Sudah Test', 'Belum Test', 'Progress (%)']
  ];
  
  for (let sesi = 1; sesi <= 3; sesi++) {
    const sesiStudents = filteredData.filter(s => s.sesi == sesi);
    const completed = sesiStudents.filter(s => s.sudah_test === 1).length;
    const notCompleted = sesiStudents.length - completed;
    const percentage = sesiStudents.length > 0 
      ? Math.round((completed / sesiStudents.length) * 100) 
      : 0;
    
    summaryData.push([
      `Sesi ${sesi}`,
      sesiStudents.length,
      completed,
      notCompleted,
      `${percentage}%`
    ]);
  }
  
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan');
  
  // Sheet 2: Detail Siswa
  const studentsData = [
    ['No', 'No Pendaftaran', 'Nama', 'Orang Tua', 'Sesi', 'Gender', 'Status', 'Meja', 'Durasi']
  ];
  
  filteredData.forEach((s, i) => {
    const status = s.sudah_test === 1 ? 'Sudah Test' : 'Belum Test';
    const meja = s.meja_asal ? s.meja_asal.replace('meja-', '') : '-';
    
    let duration = '-';
    if (s.sudah_test === 1 && s.test_start_time && s.test_end_time) {
      const start = new Date(s.test_start_time);
      const end = new Date(s.test_end_time);
      duration = formatDuration(end - start);
    }
    
    studentsData.push([
      i + 1,
      s.no_pendaftaran,
      s.nama_murid,
      s.nama_orang_tua || '-',
      s.sesi || 1,
      s.jenis_kelamin,
      status,
      meja,
      duration
    ]);
  });
  
  const ws2 = XLSX.utils.aoa_to_sheet(studentsData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Detail Siswa');
  
  // Sheet 3: Per Meja
  const mejaData = [
    ['Meja', 'Penguji', 'Jumlah Siswa', 'Rata-rata Durasi']
  ];
  
  for (let i = 1; i <= 5; i++) {
    const mejaStudents = filteredData.filter(s => 
      s.meja_asal === `meja-${i}` && s.sudah_test === 1
    );
    
    const mejaTeachers = teachersData.filter(t => t.meja_number === i);
    const teacherNames = mejaTeachers.map(t => t.teacher_name).join(' & ') || 'Belum diatur';
    
    const studentsWithDuration = mejaStudents.filter(s => 
      s.test_start_time && s.test_end_time
    );
    
    let avgDuration = '-';
    if (studentsWithDuration.length > 0) {
      const totalDuration = studentsWithDuration.reduce((sum, s) => {
        const start = new Date(s.test_start_time);
        const end = new Date(s.test_end_time);
        return sum + (end - start);
      }, 0);
      
      const avgMs = totalDuration / studentsWithDuration.length;
      avgDuration = formatDuration(avgMs);
    }
    
    mejaData.push([
      `Meja ${i}`,
      teacherNames,
      mejaStudents.length,
      avgDuration
    ]);
  }
  
  const ws3 = XLSX.utils.aoa_to_sheet(mejaData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Per Meja');
  
  // Save file
  const fileName = `Laporan_Test_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// Event listeners
document.getElementById('apply-filter-btn').addEventListener('click', () => {
  applyFilters();
  generateReports();
});

// Auto-apply filter when dropdown changes (no need to click button)
document.getElementById('filter-sesi').addEventListener('change', () => {
  applyFilters();
  generateReports();
});

document.getElementById('filter-gender').addEventListener('change', () => {
  applyFilters();
  generateReports();
});

document.getElementById('filter-status').addEventListener('change', () => {
  applyFilters();
  generateReports();
});

document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);

document.getElementById('print-btn').addEventListener('click', () => {
  window.print();
});

document.getElementById('refresh-btn').addEventListener('click', loadData);

document.getElementById('logout-btn').addEventListener('click', () => {
  if (confirm('Logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
  }
});

// Initialize
loadData();
