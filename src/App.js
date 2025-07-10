import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Topstars from './pages/Topstars/Topstars';
import Blogs from './pages/blogs/Blogs';
import Hospital from './pages/Hospital/HospitalCategory';
import HospitalDoctors from './pages/Hospital/hospital-B/HospitalDoctors';
import DoctorDetails from './pages/Hospital/hospital-c/DoctorDetails';
import Doctor from './pages/Doctor/Doctor';
import NotFound from './pages/NotFound/NotFound';
import HospitalArea from './pages/Hospital/hospital-A/HospitalArea';
import DoctorName from './pages/Doctor/Doctor-A/DoctorName';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topstars" element={<Topstars />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/hospital" element={<Hospital />} />
           <Route path="hospital/:hospitalTypeId/categories/:categoryName/doctors" element={<HospitalDoctors />} />
           <Route path="/hospitals/:hospitalId/categories/:categoryName/doctors/:doctorId" element={<DoctorDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/doctor" element={<Doctor/>} />

          <Route path='/hospital/:hospitalTypeId' element={<HospitalArea/>} />
          <Route path='/hospital/:hospitalTypeId/:hospitalId' element={<DoctorName />} />
          <Route path="/doctor/:doctorTypeId" element={<DoctorName />} />
          <Route path="/doctordetails/:doctorId" element={<DoctorDetails />} />

        </Routes>
      </div>
    </div>
  );
}
export default App;