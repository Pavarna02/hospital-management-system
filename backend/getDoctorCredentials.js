const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

mongoose.connect('mongodb://localhost:27017/hospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function getDoctorCredentials() {
  try {
    // Find all doctors
    const doctors = await Doctor.find().populate('user');
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🏥 ALL DOCTOR LOGIN CREDENTIALS (40 Doctors)');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Password for ALL doctors: doctor123\n');
    
    // Group by specialization
    const grouped = {};
    doctors.forEach(doctor => {
      if (!grouped[doctor.specialization]) {
        grouped[doctor.specialization] = [];
      }
      grouped[doctor.specialization].push(doctor);
    });
    
    // Print by specialization
    for (const [specialization, docs] of Object.entries(grouped)) {
      console.log(`\n━━━ ${specialization.toUpperCase()} (${docs.length} doctors) ━━━`);
      docs.forEach((doctor, index) => {
        console.log(`${index + 1}. ${doctor.user.name}`);
        console.log(`   Email: ${doctor.user.email}`);
        console.log(`   Password: doctor123`);
      });
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`Total: ${doctors.length} doctors\n`);
    
    // Create formatted list
    console.log('\n📋 COPY-PASTE FORMAT:\n');
    doctors.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.user.email} / doctor123`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getDoctorCredentials();
