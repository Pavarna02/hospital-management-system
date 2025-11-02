import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState(null);

  const apiUrl = 'http://localhost:5000';

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      // Find doctor by user ID
      const response = await axios.get(`${apiUrl}/api/doctors`);
      const doctor = response.data.find(d => d.user._id === user.id);
      
      if (doctor) {
        setDoctorInfo(doctor);
        fetchAppointments(doctor._id);
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      setLoading(false);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      await axios.put(`${apiUrl}/api/appointments/${appointmentId}/accept`);
      alert('Appointment accepted!');
      fetchAppointments(doctorInfo._id);
    } catch (error) {
      console.error('Error accepting appointment:', error);
      alert('Error accepting appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await axios.put(`${apiUrl}/api/appointments/${appointmentId}/reject`);
      alert('Appointment rejected');
      fetchAppointments(doctorInfo._id);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('Error rejecting appointment');
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={onLogout} style={{marginLeft: '20px'}}>Logout</button>
        </div>
      </div>

      {doctorInfo && (
        <div className="doctor-info">
          <h2>Dr. {doctorInfo.user.name}</h2>
          <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
          <p><strong>Experience:</strong> {doctorInfo.experience} years</p>
        </div>
      )}

      <div className="appointments-section">
        <h2>Pending Appointments ({pendingAppointments.length})</h2>
        {pendingAppointments.length === 0 ? (
          <p>No pending appointments</p>
        ) : (
          <div className="appointments-list">
            {pendingAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card pending">
                <h3>Patient: {appointment.patient?.name}</h3>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                <p><strong>Contact:</strong> {appointment.patient?.phone}</p>
                <div className="appointment-actions">
                  <button 
                    className="btn-accept"
                    onClick={() => handleAccept(appointment._id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(appointment._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{marginTop: '2rem'}}>Confirmed Appointments ({confirmedAppointments.length})</h2>
        {confirmedAppointments.length === 0 ? (
          <p>No confirmed appointments</p>
        ) : (
          <div className="appointments-list">
            {confirmedAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card confirmed">
                <h3>Patient: {appointment.patient?.name}</h3>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                <p><strong>Contact:</strong> {appointment.patient?.phone}</p>
                <span className="status-badge confirmed">Confirmed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
