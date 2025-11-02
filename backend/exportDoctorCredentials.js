const mongoose = require('mongoose');
const fs = require('fs');

// Import models
const User = require('./models/User');
const Doctor = require('./models/Doctor');

mongoose.connect('mongodb://localhost:27017/hospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function exportToCSV() {
  try {
    console.log('🔍 Fetching doctors from database...\n');
    
    const doctors = await Doctor.find().populate('user');
    
    console.log(`✅ Found ${doctors.length} doctors\n`);
    
    // Create CSV content
    let csv = 'Name,Email,Password,Specialization,Experience,Fees\n';
    
    doctors.forEach(doctor => {
      csv += `"${doctor.user.name}","${doctor.user.email}","doctor123","${doctor.specialization}",${doctor.experience},${doctor.feesPerSession}\n`;
    });
    
    // Save to file
    fs.writeFileSync('doctor_credentials.csv', csv);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ SUCCESS! Exported to doctor_credentials.csv');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📊 Total doctors: ${doctors.length}`);
    console.log(`📁 File location: ${__dirname}\\doctor_credentials.csv\n`);
    
    // Also print to console
    console.log('📋 DOCTOR CREDENTIALS:\n');
    console.log('Password for ALL doctors: doctor123\n');
    
    doctors.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.user.name}`);
      console.log(`   Email: ${doctor.user.email}`);
      console.log(`   Specialization: ${doctor.specialization}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

exportToCSV();
