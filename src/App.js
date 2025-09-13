import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Topstars from './pages/Topstars/Topstars';
import Blogs from './pages/blogs/Blogs';
import Hospital from './pages/Hospital/HospitalCategory';
import HospitalDoctors from './pages/Hospital/hospital-B/HospitalDoctors';
import HospitalInfo from './pages/Hospital/hospital-info/Hospital_info';
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
import BlogTopic from './pages/blogs/BlogTopic';
import CharityList from './pages/Charity/CharityList';
import PrimecareIcon from './pages/PrimecareIcon/PrimecareIcon';
import Traditional3 from './pages/traditionaltreatments/Traditional3';
import Traditional2 from './pages/traditionaltreatments/Traditional2';
import Traditional1 from './pages/traditionaltreatments/Traditional1';
import Events from './pages/Events/Events';
import OffersPage from './pages/Offers/Offers';
import BlogTopics from './pages/blogs/Blogs';
import BlogManagement from './pages/blogs/BlogTopic';
import ProductTypePage0 from './pages/Products/Products0/ProductPage0';
import ServicePage0 from './pages/Service/ServicePage0';
import Booking from './pages/Booking/Booking';
import Quiz from './pages/Quiz/Quiz';
import Stages from './pages/Quiz/Stages';
import QuizData from './pages/Quiz/QuizData';
import Quizprogress from './pages/Quiz/Quizprogress';
import Quizresult from './pages/Quiz/Quizresult';
import EmployeeForm from './Crm_pages/Employes/employes';
import RegisterOrder from './Crm_pages/Register_orders/RegisterOrder';


function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topstars" element={<Topstars />} />
          {/* <Route path="/blogs" element={<BlogTopic />} />
          <Route path="/blog/:blogId" element={<Blogs />} /> */}
          <Route path="/blogs" element={<BlogTopics />} />
          <Route path="/blogs/:id" element={<BlogManagement />} />
          <Route path="/Charities" element={<CharityList />} />
          <Route path="/primecareicon" element={<PrimecareIcon />} />
          <Route path="/event" element={<Events />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/employeeform" element={<EmployeeForm />} />
          <Route path="/registerorder" element={<RegisterOrder />} />

          <Route path="/hospital" element={<Hospital />} />
           <Route path="hospital/:hospitalTypeId/categories/:categoryName/doctors" element={<HospitalDoctors />} />
           <Route path="/hospitals/:hospitalId/categories/:categoryName/doctors/:doctorId" element={<DoctorDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/doctor" element={<Doctor/>} />

          <Route path='hospital-information/hospital/:hospitalId' element={<HospitalInfo/>}/>

          <Route path='/hospital/:hospitalTypeId' element={<HospitalArea/>} />
          <Route path='/hospital/:hospitalTypeId/:hospitalId' element={<DoctorName />} />
          <Route path="/doctor/:doctorTypeId" element={<DoctorName />} />
          <Route path="/doctordetails/:doctorId" element={<DoctorDetails />} />

          <Route path="/product" element={<ProductTypePage0 />} />
          <Route path="/product/:productTypeId" element={<ProductPage1 />} />
          <Route path="/product/:productTypeId/:productId" element={<Productpage2 />} />
          <Route path="/product/:productTypeId/:productId/:productTypeId" element={<Productpage3 />} />
          <Route path="/productdetails/:productId" element={<ProductPage4 />} />
          {/* <Route path="/product/:productId" element={<Productpage2 />} />
          <Route path="/product/:productId/:productTypeId" element={<Productpage3 />} />
          <Route path="/productdetails/:productId" element={<ProductPage4 />} /> */}

          <Route path='/service' element={<ServicePage0 />} />
          <Route path='/service/:availableServiceTypeId' element={<ServicePage />} />
          <Route path='/service/:availableServiceTypeId/:availableServiceId' element={<ServicePage1 />} />
          <Route path='/service/:availableServiceTypeId/:availableServiceId/:serviceTypeId' element={<ServicePage2 />} />
          <Route path='/servicedetails/:serviceId' element={<ServicePage3 />} />

          {/* <Route path='/service/:availableServiceId' element={<ServicePage1 />} />
          <Route path='/service/:availableServiceId/:serviceTypeId' element={<ServicePage2 />} />
          <Route path='/servicedetails/:serviceId' element={<ServicePage3 />} /> */}

          <Route path="/traditional" element={<Traditional1 />} />
          <Route path="/traditional/:hospitalTypeId" element={<Traditional2 />} />
          <Route path="/traditional/:hospitalTypeId/:hospitalId" element={<Traditional3 />} />


          <Route path="/booking" element={<Booking />} />

          <Route path='/stages' element={<Stages/>}/>
          <Route path='/quiz/:id' element={<Quiz/>}/>

          <Route path='/userdata' element={<QuizData/>}/>
          <Route path='/progress/:userId' element={<Quizprogress/>}/>
          <Route path='/result/:userId' element={<Quizresult/>}/>

        </Routes>
      </div>
    </div>
  );
}
export default App;