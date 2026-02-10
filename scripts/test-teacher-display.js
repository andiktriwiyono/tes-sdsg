const http = require('http');

const BASE_URL = 'http://localhost:8888';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET'
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
    req.end();
  });
}

async function testTeacherDisplay() {
  console.log('🧪 Testing Teacher Display in Meja Headers\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Load teachers from API
    console.log('\n1️⃣  Loading teachers from API...');
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
    
    // Test 2: Display expected output
    console.log('\n2️⃣  Expected display in Meja headers:');
    Object.keys(teachersByMeja).sort().forEach(meja => {
      const mejaTeachers = teachersByMeja[meja];
      if (mejaTeachers.length === 2) {
        console.log(`   Meja ${meja}: 👨‍🏫 ${mejaTeachers[0].teacher_name} & ${mejaTeachers[1].teacher_name}`);
      } else if (mejaTeachers.length === 1) {
        console.log(`   Meja ${meja}: 👨‍🏫 ${mejaTeachers[0].teacher_name}`);
      }
    });

    // Test 3: Check HTML has the IDs
    console.log('\n3️⃣  Checking HTML structure...');
    const html = await makeRequest('/');
    
    for (let i = 1; i <= 5; i++) {
      const hasId = html.includes(`id="meja-${i}-teachers"`);
      if (hasId) {
        console.log(`   ✅ Meja ${i} header ID exists`);
      } else {
        console.log(`   ❌ Meja ${i} header ID NOT found!`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETE!\n');
    console.log('📋 What to expect in browser:');
    console.log('   - Meja 1 header: "👨‍🏫 Guru 1A & Guru 1B"');
    console.log('   - Meja 2 header: "👨‍🏫 Guru 2A & Guru 2B"');
    console.log('   - Meja 3 header: "👨‍🏫 Guru 3A & Guru 3B"');
    console.log('   - Meja 4 header: "👨‍🏫 Guru 4A & Guru 4B"');
    console.log('   - Meja 5 header: "👨‍🏫 Guru 5A & Guru 5B"');
    console.log('\n💡 Next steps:');
    console.log('   1. Refresh browser (Ctrl+F5)');
    console.log('   2. Check Meja Penguji headers');
    console.log('   3. Should show teacher names instead of "Kapasitas: 1 siswa"');
    console.log('   4. Edit teacher names in Admin Panel to test updates\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

testTeacherDisplay();
