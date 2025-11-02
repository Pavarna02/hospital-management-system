const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

mongoose.connect('mongodb://localhost:27017/hospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updateEmails() {
  try {
    // Get all doctors, including user refs
    const doctors = await Doctor.find().populate('user');
    let updatedCount = 0;

    for (const doctor of doctors) {
      const name = doctor.user.name
        .replace("Dr. ", "")
        .toLowerCase()
        .replace(/ /g, "."); // "Dr. Rahul Mehta" → "rahul.mehta"
      const newEmail = `dr.${name}@hospital.com`;
      const alreadySet = doctor.user.email === newEmail;
      if (!alreadySet) {
        await User.findByIdAndUpdate(doctor.user._id, { email: newEmail });
        updatedCount++;
        console.log(`Updated: ${doctor.user.name} → ${newEmail}`);
      } else {
        console.log(`Already OK: ${doctor.user.name} → ${newEmail}`);
      }
    }

    console.log(`\n✅ Update complete. Total doctors updated: ${updatedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating:', error);
    process.exit(1);
  }
}

updateEmails();
