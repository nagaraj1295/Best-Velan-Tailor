import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminProfile', JSON.stringify(res.data.admin));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || `Connection Error: ${err.message}. Please check if the backend is running and VITE_API_URL is correct.`);
        }
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1B3D'}}>
            <div style={{backgroundColor: '#fff', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'}}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <h2 style={{fontFamily: 'Playfair Display', color: '#0B1B3D', fontSize: '2rem', marginBottom: '10px'}}>Admin Login</h2>
                    <p style={{color: '#666'}}>Secure access for Best Velan Tailor</p>
                </div>
                
                {error && <div style={{backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center'}}>{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div style={{marginBottom: '20px', position: 'relative'}}>
                        <User size={20} style={{position: 'absolute', top: '12px', left: '12px', color: '#999'}} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'}}
                        />
                    </div>
                    <div style={{marginBottom: '25px', position: 'relative'}}>
                        <Lock size={20} style={{position: 'absolute', top: '12px', left: '12px', color: '#999'}} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'}}
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%', padding: '14px', backgroundColor: '#D4AF37', color: '#0B1B3D', 
                        border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                        Secure Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
