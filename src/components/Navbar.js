import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';

axios.defaults.withCredentials = true;


function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  const handleLogout = () => {
    axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true
    })
    .then(() => {
      console.log('logout success!')
      localStorage.removeItem('token');
      logout();
      navigate('/login');
    })
    .catch(error => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <nav className='nav-bar'>
      <ul>
        <div className="nav-links">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated && <li><Link to="/add">Add New Plan</Link></li>}
        </div>
        <div className="nav-actions">
          {isAuthenticated && (
            <li><button onClick={handleLogout}>Logout</button></li>
          )}
          {!isAuthenticated && (
            <li><Link to="/login">Login</Link></li>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
