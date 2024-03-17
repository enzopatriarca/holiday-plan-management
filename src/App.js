import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import HolidayList from './components/HolidayList';
import HolidayDetails from './components/HolidayDetails';
import HolidayForm from './components/HolidayForm';
import { ProtectedRoute } from './ProtectedRoute';
import './App.css';
import UpdateHolidayPlan from './components/UpdateHolidayPlan';

// Now, useLocation is correctly imported and can be used within Layout component
const Layout = () => {
  const location = useLocation(); // This will now work correctly

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HolidayList /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><HolidayForm /></ProtectedRoute>} />
          <Route path="/details/:id" element={<ProtectedRoute><HolidayDetails /></ProtectedRoute>} />
          <Route path="/update/:id" element={<UpdateHolidayPlan />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Layout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
