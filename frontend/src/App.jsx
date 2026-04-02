import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import BookingDetails from './pages/BookingDetails';
import Service from './pages/Service';
import ServiceDetails from './pages/ServiceDetails'; 
import Blog from './pages/Blog';
import Home from './pages/Home';        
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import MyTrips from './pages/MyTrips';
import SavedPassengers from './pages/SavedPassengers';
import Payment from './pages/Payment';
import ManageBooking from './pages/ManageBooking';
import FlightStatus from './pages/FlightStatus';
import AdminDashboard from './pages/admin/AdminDashboard';
function App() {

  return (
    <BrowserRouter>
  
      <Routes>
   
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />            
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booking" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="service" element={<Service />} />
          <Route path="profile" element={<Profile />} />
          <Route path="service-details" element={<ServiceDetails />} /> 
          <Route path="booking-details" element={<BookingDetails />} />
          <Route path="blog" element={<Blog />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/saved-passengers" element={<SavedPassengers />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/manage-booking" element={<ManageBooking />} />
          <Route path="/flight-status" element={<FlightStatus />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;