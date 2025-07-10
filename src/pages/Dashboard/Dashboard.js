import React from 'react';
import './Dashboard.css';

// Sample data for hospital stats (this could be fetched dynamically from an API)
const stats = {
  totalPatients: 1200,
  totalDoctors: 150,
  totalStaff: 300,
  patientSatisfaction: 85, // Percentage
  revenueThisMonth: 500000, // In dollars
  recentUpdates: [
    'New cardiology department opening next week.',
    'Upcoming health camp for free health checkups.',
    'Dr. John Doe awarded for excellence in cardiology.'
  ]
};

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Hospital Dashboard</h1>
      
      {/* Key Metrics Section */}
      <div className="metrics-container">
        <div className="metric-card">
          <h2>Total Patients</h2>
          <p>{stats.totalPatients}</p>
        </div>
        <div className="metric-card">
          <h2>Total Doctors</h2>
          <p>{stats.totalDoctors}</p>
        </div>
        <div className="metric-card">
          <h2>Total Staff</h2>
          <p>{stats.totalStaff}</p>
        </div>
        <div className="metric-card">
          <h2>Patient Satisfaction</h2>
          <p>{stats.patientSatisfaction}%</p>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="revenue-container">
        <h2>Revenue This Month</h2>
        <p>${stats.revenueThisMonth}</p>
      </div>

      {/* Recent Updates Section */}
      <div className="recent-updates-container">
        <h2>Recent Updates</h2>
        <ul>
          {stats.recentUpdates.map((update, index) => (
            <li key={index}>{update}</li>
          ))}
        </ul>
      </div>

      {/* Optional: Include Charts */}
      {/* <DashboardChart /> */}
    </div>
  );
}
