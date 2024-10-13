import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header'; // Import Header component
import AddVehicle from './components/AddVehicle'; // Import AddVehicle component
import AllVehicle from './components/AllVehicle'; // Import AllVehicle component
import UpdateVehicle from './components/UpdateVehicle'; // Import UpdateVehicle component
import BookVehicle from './components/BookVehicle'; // Import BookVehicle component
import BookingList from './components/BookingList'; // Import BookingList component
import AddProperty from './components/AddProperty';
import CreatePackage from './components/CreatePackage';
import PackageManagement from './components/PackageManagement';
import ConnectPackage from './components/ConnectPackage';



import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          
          <Route path="/" element={<AllVehicle />} />
          <Route path="/update-vehicle/:vehicleNo" element={<UpdateVehicle />} />
          <Route path="/book-vehicle" element={<BookVehicle />} />
          <Route path="/bookings" element={<BookingList />} /> {/* Route for bookings list */}
          <Route path ="/add" element = {<AddVehicle/>}/>
          <Route path="/property/add" element={<AddProperty />} />
          <Route path="/Package/packages" element={<CreatePackage />} />
          <Route path="/Package/packages" element={<CreatePackage />} />
          <Route path="/Package/packageManagement" element={<PackageManagement />} />
          <Route path="/Package/commentPackage" element={<ConnectPackage />} />

          

    
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
