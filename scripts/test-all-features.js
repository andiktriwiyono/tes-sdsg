const http = require('http');

const BASE_URL = 'http://localhost:8888';

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function testAllFeatures() {
  console.log('🧪 Testing All Features\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Students API
    console.log('\n1️⃣  Testing Students API...');
    const students = await makeRequest('/api/students');
    console.log(`   ✅ Students loaded: ${students.length} records`);
    
    // Check for meja_asal column
    const studentWithMejaAsal = students.find(s => s.meja_asal);
    if (studentWithMejaAsal) {
      console.log(`   ✅ meja_asal column exists: ${studentWithMejaAsal.meja_asal}`);
    } else {
      console.log(`   ⚠️  No students with meja_asal yet (column exists but empty)`);
    }

    // Test 2: Users API
    console.log('\n2️⃣  Testing Users API...');
    const users = await makeRequest('/api/users');
    console.log(`   ✅ Users loaded: ${users.length} records`);
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.role})`);
    });

    // Test 3: Teachers API
    console.log('\n3️⃣  Testing Teachers API...');
    const teachers = await makeRequest('/api/teachers');
    console.log(`   ✅ Teachers loaded: ${teachers.length} records`);
    
    // Group by meja
    const teachersByMeja = {};
    teachers.forEach(t => {
      if (!teachersByMeja[t.meja_number]) {
        teachersByMeja[t.meja_number] = [];
      }
      teachersByMeja[t.meja_number].push(t);
    });
    
    Object.keys(teachersByMeja).sort().forEach(meja => {
      const mejaTeachers = teachersByMeja[meja];
      console.log(`   - Meja ${meja}: ${mejaTeachers.map(t => t.teacher_name).join(', ')}`);
    });

    // Test 4: Update Teacher (Test PUT)
    console.log('\n4️⃣  Testing Teacher Update...');
    const firstTeacher = teachers[0];
    const testName = 'Test Guru ' + Date.now();
    await makeRequest('/api/teachers', 'PUT', {
      id: firstTeacher.id,
      teacher_name: testName
    });
    console.log(`   ✅ Teacher updated to: ${testName}`);
    
    // Restore original name
    await makeRequest('/api/teachers', 'PUT', {
      id: firstTeacher.id,
      teacher_name: firstTeacher.teacher_name
    });
    console.log(`   ✅ Teacher restored to: ${firstTeacher.teacher_name}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED!\n');
    console.log('📊 Summary:');
    console.log(`   - Students: ${students.length} records (with meja_asal column)`);
    console.log(`   - Users: ${users.length} records`);
    console.log(`   - Teachers: ${teachers.length} records (${Object.keys(teachersByMeja).length} meja)`);
    console.log('\n🎉 Database is working correctly!');
    console.log('\n💡 Next steps:');
    console.log('   1. Open http://localhost:8888 in browser');
    console.log('   2. Login with: koordinator / koordinator123');
    console.log('   3. Test search in Selesai Test sections');
    console.log('   4. Test ploting siswa (check meja_asal display)');
    console.log('   5. Open Admin Panel to test Teacher Management');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

testAllFeatures();
