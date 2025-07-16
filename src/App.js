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
import ProductPage1 from './pages/Products/Products1/ProductPage1';
import Productpage2 from './pages/Products/Products2/Productpage2';
import Productpage3 from './pages/Products/Products3/ProductPage3';
import ProductPage4 from './pages/Products/Products4/ProductPage4';
import ServicePage from './pages/Service/Service_page';
import ServicePage1 from './pages/Service/ServicePage1';
import ServicePage2 from './pages/Service/ServicePage2';
import ServicePage3 from './pages/Service/ServicePage3';

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

          <Route path="/product" element={<ProductPage1 />} />
          <Route path="/product/:productId" element={<Productpage2 />} />
          <Route path="/product/:productId/:productTypeId" element={<Productpage3 />} />
          <Route path="/productdetails/:productId" element={<ProductPage4 />} />

          <Route path='/service' element={<ServicePage />} />
          <Route path='/service/:availableServiceId' element={<ServicePage1 />} />
          <Route path='/service/:availableServiceId/:serviceTypeId' element={<ServicePage2 />} />
          <Route path='/servicedetails/:serviceId' element={<ServicePage3 />} />


        </Routes>
      </div>
    </div>
  );
}
export default App;