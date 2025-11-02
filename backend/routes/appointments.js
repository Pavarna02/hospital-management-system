const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create appointment (NO AUTH for testing)
router.post('/', async (req, res) => {
  try {
    console.log('Appointment request received:', req.body);
    
    const { doctorId, patientId, date, timeSlot, reason } = req.body;

    // Validate input
    if (!doctorId || !patientId || !date || !timeSlot || !reason) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { doctorId, patientId, date, timeSlot, reason }
      });
    }

    const appointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      date: new Date(date),
      timeSlot,
      reason,
      status: 'pending'
    });

    await appointment.save();
    console.log('Appointment saved successfully:', appointment);
    
    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Error booking appointment',
      error: error.message 
    });
  }
});

// Get user appointments
router.get('/user/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.userId })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get doctor's appointments
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient')
      .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Accept appointment
router.put('/:id/accept', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment confirmed', appointment });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ message: 'Error accepting appointment' });
  }
});

// Reject appointment
router.put('/:id/reject', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment rejected', appointment });
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    res.status(500).json({ message: 'Error rejecting appointment' });
  }
});

// Cancel appointment
router.put('/:id/cancel', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

module.exports = router;

