import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../assets/logo-dark.svg';
import axios from 'axios';

axios.defaults.withCredentials = true;


function Login() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
    
        const loginData = {
            email: username,
            password: password,
        };
    
        
        axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
            withCredentials: true
        }).then(() => {
            
            return axios.post('http://127.0.0.1:8000/api/login', loginData, {
                headers: {
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
        }).then(response => {
            const token = response.data.token;
            const user_id = response.data.id;    
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);
            setIsAuthenticated(true);
        }).catch(error => {
            let errorMessage = "";

            
            const fieldErrors = error.response?.data?.errors;
            if (fieldErrors) {
                
                errorMessage = Object.keys(fieldErrors)
                                    .map(field => `${fieldErrors[field].join(" ")}`)
                                    .join(", ");
            } else {
                
                errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            }
        
            setLoginError(errorMessage);
        });
    };
    
    

    return (
        <div className="login-container centered-container">
            <img src={logo} alt="Logo" className="login-logo"/>
            <form onSubmit={handleLogin}>

                {loginError && <div className="alert alert-danger">{loginError}</div>}  
                
                <div className="form-group widht-login">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group widht-login">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='btn btn-success' type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
