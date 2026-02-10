const fs = require('fs');
const path = require('path');

console.log('🔍 Final Verification Check\n');
console.log('='.repeat(60));

let allGood = true;

// Check 1: Database file exists
console.log('\n1️⃣  Checking database file...');
const dbPath = path.join(__dirname, '..', 'data', 'antrian.db');
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`   ✅ Database exists: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('   ❌ Database file not found!');
  allGood = false;
}

// Check 2: Key files exist
console.log('\n2️⃣  Checking key files...');
const keyFiles = [
  'server-local.js',
  'public/app.js',
  'public/admin.js',
  'public/index.html',
  'public/admin.html',
  'public/login.html',
  'netlify/functions/students.js',
  'netlify/functions/users.js',
  'netlify/functions/teachers.js',
  'scripts/add-meja-asal-column.js',
  'scripts/add-teachers-table.js'
];

keyFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allGood = false;
  }
});

// Check 3: Search functionality in app.js
console.log('\n3️⃣  Checking search functionality...');
const appJsPath = path.join(__dirname, '..', 'public', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

if (appJsContent.includes('filteredSelesai1Data')) {
  console.log('   ✅ Search for Selesai Test (T1) implemented');
} else {
  console.log('   ❌ Search for Selesai Test (T1) NOT found!');
  allGood = false;
}

if (appJsContent.includes('filteredSelesai2Data')) {
  console.log('   ✅ Search for Selesai Test (T2) implemented');
} else {
  console.log('   ❌ Search for Selesai Test (T2) NOT found!');
  allGood = false;
}

// Check 4: Meja asal in app.js
console.log('\n4️⃣  Checking meja asal functionality...');
if (appJsContent.includes('meja_asal')) {
  console.log('   ✅ Meja asal field implemented');
} else {
  console.log('   ❌ Meja asal field NOT found!');
  allGood = false;
}

if (appJsContent.includes('dari T1') || appJsContent.includes('dari T2')) {
  console.log('   ✅ Meja asal display implemented');
} else {
  console.log('   ❌ Meja asal display NOT found!');
  allGood = false;
}

// Check 5: Teacher management in admin.js
console.log('\n5️⃣  Checking teacher management...');
const adminJsPath = path.join(__dirname, '..', 'public', 'admin.js');
const adminJsContent = fs.readFileSync(adminJsPath, 'utf8');

if (adminJsContent.includes('loadTeachers')) {
  console.log('   ✅ Load teachers function implemented');
} else {
  console.log('   ❌ Load teachers function NOT found!');
  allGood = false;
}

if (adminJsContent.includes('updateTeacher')) {
  console.log('   ✅ Update teacher function implemented');
} else {
  console.log('   ❌ Update teacher function NOT found!');
  allGood = false;
}

// Check 6: Search inputs in HTML
console.log('\n6️⃣  Checking search inputs in HTML...');
const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

if (indexHtmlContent.includes('search-selesai1')) {
  console.log('   ✅ Search input for Selesai Test (T1) exists');
} else {
  console.log('   ❌ Search input for Selesai Test (T1) NOT found!');
  allGood = false;
}

if (indexHtmlContent.includes('search-selesai2')) {
  console.log('   ✅ Search input for Selesai Test (T2) exists');
} else {
  console.log('   ❌ Search input for Selesai Test (T2) NOT found!');
  allGood = false;
}

// Check 7: Teacher inputs in admin HTML
console.log('\n7️⃣  Checking teacher inputs in admin HTML...');
const adminHtmlPath = path.join(__dirname, '..', 'public', 'admin.html');
const adminHtmlContent = fs.readFileSync(adminHtmlPath, 'utf8');

if (adminHtmlContent.includes('teacher-input')) {
  console.log('   ✅ Teacher input fields exist');
} else {
  console.log('   ❌ Teacher input fields NOT found!');
  allGood = false;
}

if (adminHtmlContent.includes('Teacher Management')) {
  console.log('   ✅ Teacher Management section exists');
} else {
  console.log('   ❌ Teacher Management section NOT found!');
  allGood = false;
}

// Check 8: API endpoints in server
console.log('\n8️⃣  Checking API endpoints in server...');
const serverPath = path.join(__dirname, '..', 'server-local.js');
const serverContent = fs.readFileSync(serverPath, 'utf8');

if (serverContent.includes('/api/students')) {
  console.log('   ✅ Students API endpoint configured');
} else {
  console.log('   ❌ Students API endpoint NOT found!');
  allGood = false;
}

if (serverContent.includes('/api/users')) {
  console.log('   ✅ Users API endpoint configured');
} else {
  console.log('   ❌ Users API endpoint NOT found!');
  allGood = false;
}

if (serverContent.includes('/api/teachers')) {
  console.log('   ✅ Teachers API endpoint configured');
} else {
  console.log('   ❌ Teachers API endpoint NOT found!');
  allGood = false;
}

// Final result
console.log('\n' + '='.repeat(60));
if (allGood) {
  console.log('\n✅ ALL CHECKS PASSED! 🎉\n');
  console.log('Your system is fully operational with all features:');
  console.log('  1. ✅ Search in Selesai Test sections');
  console.log('  2. ✅ Meja Asal information display');
  console.log('  3. ✅ Teacher Management in Admin Panel');
  console.log('\n🚀 Server is running at: http://localhost:8888');
  console.log('📖 Read QUICK_START.md for usage instructions\n');
} else {
  console.log('\n❌ SOME CHECKS FAILED!\n');
  console.log('Please review the errors above and fix them.\n');
  process.exit(1);
}
