// Check if user is admin
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
if (!currentUser.username || currentUser.role !== 'ADMIN') {
  alert('Access Denied! Admin only.');
  window.location.href = '/';
}

// API URLs - gunakan /api/* untuk semua environment
const API_URL = '/api/students';
const USERS_API_URL = '/api/users';
const TEACHERS_API_URL = '/api/teachers';

// Load users from database
async function getUsers() {
  try {
    const response = await fetch(USERS_API_URL);
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

async function saveUser(userData) {
  try {
    const response = await fetch(USERS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save user');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function updateUser(userData) {
  try {
    const response = await fetch(USERS_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function deleteUserById(id) {
  try {
    const response = await fetch(USERS_API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

function getRoleAccess(role) {
  const access = {
    'ADMIN': 'Full Access',
    'POS_RUANG': 'Daftar, Tunggu 1, Tunggu 2',
    'KOORDINATOR_RUANG_TEST': 'Tunggu 1, Tunggu 2, Pool Test, Semua Meja',
    'PETUGAS_ANTAR': 'Pool Test, Semua Meja, Selesai Test (Escort)',
    'PENGUJI_MEJA_1': 'Meja 1 Only',
    'PENGUJI_MEJA_2': 'Meja 2 Only',
    'PENGUJI_MEJA_3': 'Meja 3 Only',
    'PENGUJI_MEJA_4': 'Meja 4 Only',
    'PENGUJI_MEJA_5': 'Meja 5 Only'
  };
  return access[role] || '-';
}

function getRoleBadge(role) {
  const badges = {
    'ADMIN': '<span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">👑 ADMIN</span>',
    'POS_RUANG': '<span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">📋 POS RUANG</span>',
    'KOORDINATOR_RUANG_TEST': '<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">🎯 KOORDINATOR RUANG TEST</span>',
    'PETUGAS_ANTAR': '<span class="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">🚶 PETUGAS ANTAR</span>',
    'PENGUJI_MEJA_1': '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">📝 PENGUJI MEJA 1</span>',
    'PENGUJI_MEJA_2': '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">📝 PENGUJI MEJA 2</span>',
    'PENGUJI_MEJA_3': '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">📝 PENGUJI MEJA 3</span>',
    'PENGUJI_MEJA_4': '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">📝 PENGUJI MEJA 4</span>',
    'PENGUJI_MEJA_5': '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">📝 PENGUJI MEJA 5</span>'
  };
  return badges[role] || role;
}

function loadUsersTable() {
  getUsers().then(users => {
    const tbody = document.getElementById('users-table');
    
    tbody.innerHTML = users.map((user) => `
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 text-sm font-medium text-slate-800">${user.username}</td>
        <td class="px-4 py-3 text-sm text-slate-600">${user.name}</td>
        <td class="px-4 py-3">${getRoleBadge(user.role)}</td>
        <td class="px-4 py-3 text-sm text-slate-600">${getRoleAccess(user.role)}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Edit
            </button>
            <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800 text-sm font-medium">
              Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  });
}

let editingUserId = null;

function showModal(title = 'Tambah User Baru') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('user-modal').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('user-modal').classList.add('hidden');
  document.getElementById('user-form').reset();
  editingUserId = null;
}

async function editUser(userId) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;
  
  editingUserId = userId;
  document.getElementById('modal-username').value = user.username;
  document.getElementById('modal-name').value = user.name;
  document.getElementById('modal-password').value = user.password;
  document.getElementById('modal-role').value = user.role;
  
  showModal('Edit User');
}

async function deleteUser(userId) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;
  
  if (user.username === 'admin') {
    alert('Tidak bisa menghapus user admin default!');
    return;
  }
  
  if (confirm(`Hapus user "${user.username}"?`)) {
    try {
      await deleteUserById(userId);
      loadUsersTable();
      alert('User berhasil dihapus!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
}

// Make functions globally accessible
window.editUser = editUser;
window.deleteUser = deleteUser;

// Event Listeners
document.getElementById('add-user-btn').addEventListener('click', () => {
  showModal();
});

document.getElementById('cancel-btn').addEventListener('click', hideModal);

document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('modal-username').value;
  const name = document.getElementById('modal-name').value;
  const password = document.getElementById('modal-password').value;
  const role = document.getElementById('modal-role').value;
  
  try {
    if (editingUserId !== null) {
      // Edit existing user
      await updateUser({ id: editingUserId, username, name, password, role });
      alert('User berhasil diupdate!');
    } else {
      // Add new user
      await saveUser({ username, name, password, role });
      alert('User berhasil ditambahkan!');
    }
    
    loadUsersTable();
    hideModal();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  if (confirm('Logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
  }
});

// Close modal when clicking outside
document.getElementById('user-modal').addEventListener('click', (e) => {
  if (e.target.id === 'user-modal') {
    hideModal();
  }
});

// Initialize
loadUsersTable();


// System Tools Functions
async function loadSystemInfo() {
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    
    const total = students.length;
    const pool = students.filter(s => s.lokasi === 'test').length;
    const testing = students.filter(s => s.lokasi.startsWith('meja-')).length;
    const completed = students.filter(s => s.sudah_test === 1).length;
    
    document.getElementById('info-total').textContent = total;
    document.getElementById('info-pool').textContent = pool;
    document.getElementById('info-testing').textContent = testing;
    document.getElementById('info-completed').textContent = completed;
  } catch (error) {
    console.error('Error loading system info:', error);
  }
}

async function resetTestData() {
  const confirmed = confirm('⚠️ KONFIRMASI RESET DATA TEST\n\nIni akan:\n✓ Kembalikan semua siswa ke Daftar Siswa\n✓ Reset status test (sudah_test = 0)\n✓ Hapus timer dan queue\n\nLanjutkan?');
  
  if (!confirmed) return;
  
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    
    let updated = 0;
    for (const student of students) {
      if (student.lokasi !== 'daftar' || student.sudah_test === 1) {
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: student.id,
            lokasi: 'daftar',
            lokasi_asal: null,
            sudah_test: 0,
            test_start_time: null,
            test_end_time: null,
            pool_entry_time: null,
            tunggu1_entry_time: null,
            tunggu2_entry_time: null
          })
        });
        updated++;
      }
    }
    
    alert(`✅ Reset berhasil!\n\n${updated} siswa dikembalikan ke Daftar Siswa`);
    loadSystemInfo();
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
}

async function resetAllData() {
  const confirmed1 = confirm('⚠️⚠️⚠️ PERINGATAN KERAS! ⚠️⚠️⚠️\n\nIni akan MENGHAPUS SEMUA DATA SISWA!\n\nApakah Anda yakin?');
  if (!confirmed1) return;
  
  const confirmed2 = confirm('⚠️ KONFIRMASI TERAKHIR!\n\nSemua data siswa akan HILANG PERMANEN!\n\nKetik OK untuk melanjutkan (atau Cancel untuk batal)');
  if (!confirmed2) return;
  
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    
    for (const student of students) {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: student.id })
      });
    }
    
    alert(`✅ Semua data berhasil dihapus!\n\n${students.length} siswa telah dihapus dari database`);
    loadSystemInfo();
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
}

// Event Listeners for System Tools
document.getElementById('reset-test-btn').addEventListener('click', resetTestData);
document.getElementById('reset-all-btn').addEventListener('click', resetAllData);

// Sync localStorage with default users
async function syncUsersData() {
  const confirmed = confirm('🔄 RELOAD USER DATA\n\nIni akan me-refresh tabel user dari database.\n\nLanjutkan?');
  
  if (!confirmed) return;
  
  try {
    await loadUsersTable();
    alert('✅ User data berhasil di-reload dari database!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Add sync button functionality
window.syncUsersData = syncUsersData;

// Load system info on page load
loadSystemInfo();

// Refresh system info every 5 seconds
setInterval(loadSystemInfo, 5000);


// ============================================
// TEACHER MANAGEMENT
// ============================================

let teachersData = [];

// Load teachers from database
async function loadTeachers() {
  try {
    const response = await fetch(TEACHERS_API_URL);
    teachersData = await response.json();
    
    // Populate input fields
    teachersData.forEach(teacher => {
      const inputId = `teacher-${teacher.meja_number}-${teacher.position}`;
      const input = document.getElementById(inputId);
      if (input) {
        input.value = teacher.teacher_name;
        input.setAttribute('data-teacher-id', teacher.id);
      }
    });
    
    console.log('✅ Teachers loaded:', teachersData.length);
  } catch (error) {
    console.error('Error loading teachers:', error);
  }
}

// Update teacher name
async function updateTeacher(teacherId, teacherName) {
  try {
    const response = await fetch(TEACHERS_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: teacherId, teacher_name: teacherName })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update teacher');
    }
    
    console.log('✅ Teacher updated:', teacherName);
    return true;
  } catch (error) {
    console.error('Error updating teacher:', error);
    return false;
  }
}

// Setup teacher input listeners
function setupTeacherInputs() {
  const teacherInputs = document.querySelectorAll('.teacher-input');
  
  teacherInputs.forEach(input => {
    // Save on blur (when user clicks outside)
    input.addEventListener('blur', async (e) => {
      const teacherId = e.target.getAttribute('data-teacher-id');
      const teacherName = e.target.value.trim();
      
      if (!teacherId || !teacherName) return;
      
      const success = await updateTeacher(teacherId, teacherName);
      
      if (success) {
        // Visual feedback
        e.target.classList.add('border-green-500');
        setTimeout(() => {
          e.target.classList.remove('border-green-500');
        }, 1000);
      } else {
        // Error feedback
        e.target.classList.add('border-red-500');
        setTimeout(() => {
          e.target.classList.remove('border-red-500');
        }, 2000);
      }
    });
    
    // Save on Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.target.blur(); // Trigger blur event
      }
    });
  });
}

// Initialize teachers
loadTeachers().then(() => {
  setupTeacherInputs();
});


// ==========================================
// IMPORT DATA SISWA
// ==========================================

function initImportFeature() {
  // Download template Excel
  const downloadBtn = document.getElementById('download-template-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadTemplate();
    });
    console.log('✅ Download template button initialized');
  } else {
    console.error('❌ Download template button not found');
  }

  // Import button click
  const importBtn = document.getElementById('import-btn');
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      document.getElementById('import-file-input').click();
    });
    console.log('✅ Import button initialized');
  } else {
    console.error('❌ Import button not found');
  }

  // File input change
  const fileInput = document.getElementById('import-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];

      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        alert('❌ File tidak valid! Gunakan file Excel (.xlsx, .xls) atau CSV (.csv)');
        e.target.value = '';
        return;
      }

      // Show loading
      const importBtn = document.getElementById('import-btn');
      const originalText = importBtn.innerHTML;
      importBtn.disabled = true;
      importBtn.innerHTML = '<span class="animate-pulse">⏳</span> Processing...';

      try {
        await importStudentsFromFile(file);
        e.target.value = ''; // Reset input
      } catch (error) {
        console.error('Import error:', error);
        alert('❌ Error: ' + error.message);
      } finally {
        importBtn.disabled = false;
        importBtn.innerHTML = originalText;
      }
    });
    console.log('✅ File input initialized');
  } else {
    console.error('❌ File input not found');
  }
}

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImportFeature);
} else {
  // DOM already loaded
  initImportFeature();
}

function downloadTemplate() {
  try {
    // Check if XLSX is available
    if (typeof XLSX === 'undefined') {
      alert('❌ Error: Library Excel belum loaded. Refresh halaman dan coba lagi.');
      return;
    }

    // Create template data
    const templateData = [
      {
        'No Pendaftaran': '1',
        'Nama Murid': 'Contoh Nama Siswa',
        'Nama Orang Tua': 'Contoh Nama Orang Tua',
        'Jenis Kelamin': 'L',
        'Sesi': '1'
      },
      {
        'No Pendaftaran': '2',
        'Nama Murid': 'Siswa Kedua',
        'Nama Orang Tua': 'Orang Tua Kedua',
        'Jenis Kelamin': 'P',
        'Sesi': '1'
      },
      {
        'No Pendaftaran': '3',
        'Nama Murid': 'Siswa Ketiga',
        'Nama Orang Tua': 'Orang Tua Ketiga',
        'Jenis Kelamin': 'L',
        'Sesi': '1'
      }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // No Pendaftaran
      { wch: 30 }, // Nama Murid
      { wch: 30 }, // Nama Orang Tua
      { wch: 15 }, // Jenis Kelamin
      { wch: 10 }  // Sesi
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');

    // Download
    XLSX.writeFile(wb, 'Template_Import_Siswa.xlsx');
    
    alert('✅ Template berhasil didownload!\n\nPetunjuk:\n1. Isi data siswa sesuai format\n2. Jenis Kelamin: L (Laki-laki) atau P (Perempuan)\n3. Sesi: 1, 2, atau 3\n4. Simpan dan upload kembali');
  } catch (error) {
    console.error('Download template error:', error);
    alert('❌ Error download template: ' + error.message + '\n\nCoba refresh halaman dan coba lagi.');
  }
}

async function importStudentsFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length === 0) {
          throw new Error('File kosong atau format tidak sesuai!');
        }

        // Validate and transform data
        const students = [];
        const errors = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          const rowNum = i + 2; // Excel row number (header is row 1)

          // Get values (support different column names)
          const noPendaftaran = row['No Pendaftaran'] || row['no_pendaftaran'] || row['No'] || '';
          const namaMurid = row['Nama Murid'] || row['nama_murid'] || row['Nama'] || '';
          const namaOrangTua = row['Nama Orang Tua'] || row['nama_orang_tua'] || row['Orang Tua'] || '';
          const jenisKelamin = (row['Jenis Kelamin'] || row['jenis_kelamin'] || row['Gender'] || '').toString().toUpperCase();
          const sesi = row['Sesi'] || row['sesi'] || '';

          // Validate required fields
          if (!noPendaftaran || !namaMurid || !namaOrangTua) {
            errors.push(`Baris ${rowNum}: Data tidak lengkap (No Pendaftaran, Nama Murid, Nama Orang Tua wajib diisi)`);
            continue;
          }

          // Validate jenis kelamin
          if (jenisKelamin && !['L', 'P'].includes(jenisKelamin)) {
            errors.push(`Baris ${rowNum}: Jenis Kelamin harus L atau P (${namaMurid})`);
            continue;
          }

          // Validate sesi
          const sesiValue = sesi ? sesi.toString() : '';
          if (sesiValue && !['1', '2', '3'].includes(sesiValue)) {
            errors.push(`Baris ${rowNum}: Sesi harus 1, 2, atau 3 (${namaMurid})`);
            continue;
          }

          // Auto-assign sesi based on no_pendaftaran if not provided
          let finalSesi = sesiValue;
          if (!finalSesi) {
            const no = parseInt(noPendaftaran);
            if (no >= 1 && no <= 35) finalSesi = '1';
            else if (no >= 36 && no <= 71) finalSesi = '2';
            else if (no >= 72 && no <= 106) finalSesi = '3';
            else finalSesi = '1'; // default
          }

          students.push({
            no_pendaftaran: noPendaftaran.toString(),
            nama_murid: namaMurid.toString().trim(),
            nama_orang_tua: namaOrangTua.toString().trim(),
            jenis_kelamin: jenisKelamin || null,
            sesi: `sesi${finalSesi}`,
            lokasi: 'daftar',
            status: 'active',
            sudah_test: 0
          });
        }

        // Show errors if any
        if (errors.length > 0) {
          const showErrors = errors.slice(0, 10).join('\n');
          const moreErrors = errors.length > 10 ? `\n... dan ${errors.length - 10} error lainnya` : '';
          
          if (!confirm(`⚠️ Ditemukan ${errors.length} error:\n\n${showErrors}${moreErrors}\n\nLanjutkan import data yang valid (${students.length} siswa)?`)) {
            reject(new Error('Import dibatalkan'));
            return;
          }
        }

        if (students.length === 0) {
          throw new Error('Tidak ada data valid untuk diimport!');
        }

        // Confirm import
        if (!confirm(`📥 Import ${students.length} siswa?\n\nData akan ditambahkan ke database.`)) {
          reject(new Error('Import dibatalkan'));
          return;
        }

        // Import to database
        let successCount = 0;
        let failCount = 0;
        const failedStudents = [];

        for (const student of students) {
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(student)
            });

            if (response.ok) {
              successCount++;
            } else {
              failCount++;
              failedStudents.push(student.nama_murid);
            }
          } catch (error) {
            failCount++;
            failedStudents.push(student.nama_murid);
          }
        }

        // Show result
        let message = `✅ Import selesai!\n\n`;
        message += `Berhasil: ${successCount} siswa\n`;
        if (failCount > 0) {
          message += `Gagal: ${failCount} siswa\n`;
          if (failedStudents.length > 0) {
            message += `\nGagal import:\n${failedStudents.slice(0, 5).join('\n')}`;
            if (failedStudents.length > 5) {
              message += `\n... dan ${failedStudents.length - 5} lainnya`;
            }
          }
        }

        alert(message);

        // Reload system info
        loadSystemInfo();

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };

    reader.readAsArrayBuffer(file);
  });
}
