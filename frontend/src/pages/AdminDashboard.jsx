import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut, MessageCircle, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('insert-order');
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    // Insert Order State
    const [formData, setFormData] = useState({
        name: '', place: '', phone: '', materialName: '', status: 'Order Received'
    });
    const [insertMsg, setInsertMsg] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchOrders();
            fetchCustomers();
        }
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/orders`);
            setOrders(res.data);
        } catch (error) { console.error("Error fetching orders"); }
    };

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/customers`);
            setCustomers(res.data);
        } catch (error) { console.error("Error fetching customers"); }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/orders/create`, formData);
            setInsertMsg('Order created successfully!');
            setFormData({ name: '', place: '', phone: '', materialName: '', status: 'Order Received' });
            fetchOrders();
            fetchCustomers();
            setTimeout(() => setInsertMsg(''), 3000);
        } catch (error) {
            setInsertMsg('Failed to create order.');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) { console.error("Update failed"); }
    };

    const handleDeleteOrder = async (orderId) => {
        if(window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`${API_URL}/api/orders/${orderId}`);
                fetchOrders();
            } catch (error) { console.error("Delete failed"); }
        }
    };

    const openWhatsApp = (phone, orderNumber, status) => {
        const message = encodeURIComponent(`Hello, your order #${orderNumber} at Best Velan Tailors is currently: ${status}.`);
        window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'insert-order':
                return (
                    <div>
                        <h2>Create New Order</h2>
                        {insertMsg && <p style={{color: 'green', fontWeight: 'bold'}}>{insertMsg}</p>}
                        <form onSubmit={handleCreateOrder} style={{maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                            <input type="text" placeholder="Customer Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Place / City" value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Mobile Number (10 digits)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required style={inputStyle} />
                            <input type="text" placeholder="Material Name (e.g., Raymond Cotton)" value={formData.materialName} onChange={e => setFormData({...formData, materialName: e.target.value})} required style={inputStyle} />
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle}>
                                <option value="Order Received">Order Received</option>
                                <option value="Cutting & Sizing">Cutting & Sizing</option>
                                <option value="Stitching in Progress">Stitching in Progress</option>
                                <option value="Ready for Pickup">Ready for Pickup</option>
                            </select>
                            <button type="submit" style={{backgroundColor: '#27ae60', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold'}}>Create Order</button>
                        </form>
                    </div>
                );
            case 'view-orders':
                return (
                    <div>
                        <h2>All Orders</h2>
                        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff'}}>
                            <thead>
                                <tr style={{backgroundColor: '#0B1B3D', color: '#fff'}}>
                                    <th style={thStyle}>Date</th>
                                    <th style={thStyle}>Order ID</th>
                                    <th style={thStyle}>Customer</th>
                                    <th style={thStyle}>Material</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={tdStyle}><strong>{order.orderNumber}</strong></td>
                                        <td style={tdStyle}>{order.customer?.name} ({order.customer?.phone})</td>
                                        <td style={tdStyle}>{order.materialName}</td>
                                        <td style={tdStyle}>
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
                                            >
                                                <option value="Order Received">Order Received</option>
                                                <option value="Cutting & Sizing">Cutting & Sizing</option>
                                                <option value="Stitching in Progress">Stitching in Progress</option>
                                                <option value="Ready for Pickup">Ready for Pickup</option>
                                            </select>
                                        </td>
                                        <td style={tdStyle}>
                                            <button onClick={() => openWhatsApp(order.customer?.phone, order.orderNumber, order.status)} title="Send WhatsApp" style={{marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#25D366'}}>
                                                <MessageCircle size={20} />
                                            </button>
                                            <button onClick={() => handleDeleteOrder(order._id)} title="Delete Order" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c'}}>
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'customers':
                return (
                    <div>
                        <h2>Customer Directory</h2>
                        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff'}}>
                            <thead>
                                <tr style={{backgroundColor: '#0B1B3D', color: '#fff'}}>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Phone</th>
                                    <th style={thStyle}>Place</th>
                                    <th style={thStyle}>Total Visits</th>
                                    <th style={thStyle}>Last Visit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(c => (
                                    <tr key={c._id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={tdStyle}><strong>{c.name}</strong></td>
                                        <td style={tdStyle}>{c.phone}</td>
                                        <td style={tdStyle}>{c.place}</td>
                                        <td style={tdStyle}><span style={{backgroundColor: '#D4AF37', color: '#0B1B3D', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold'}}>{c.visitCount}</span></td>
                                        <td style={tdStyle}>{new Date(c.lastVisitDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h2>Admin Profile</h2>
                        <p>Profile settings (Username, Password, Picture) implementation goes here.</p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div style={{display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8'}}>
            {/* Sidebar */}
            <div style={{width: '250px', backgroundColor: '#0B1B3D', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                <h3 style={{fontFamily: 'Playfair Display', color: '#D4AF37', marginBottom: '40px', fontSize: '1.5rem'}}>Admin Panel</h3>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1}}>
                    <button onClick={() => setActiveTab('insert-order')} style={navBtnStyle(activeTab === 'insert-order')}><PlusCircle size={18}/> Insert Order</button>
                    <button onClick={() => setActiveTab('view-orders')} style={navBtnStyle(activeTab === 'view-orders')}><LayoutDashboard size={18}/> View Orders</button>
                    <button onClick={() => setActiveTab('customers')} style={navBtnStyle(activeTab === 'customers')}><Users size={18}/> Customers</button>
                    <button onClick={() => setActiveTab('profile')} style={navBtnStyle(activeTab === 'profile')}><Settings size={18}/> Profile</button>
                </div>

                <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} style={{...navBtnStyle(false), color: '#e74c3c', marginTop: 'auto'}}>
                    <LogOut size={18}/> Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={{flexGrow: 1, padding: '40px', overflowY: 'auto'}}>
                {renderContent()}
            </div>
        </div>
    );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' };
const thStyle = { padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px', textAlign: 'left' };
const navBtnStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', 
    backgroundColor: isActive ? 'rgba(212, 175, 55, 0.2)' : 'transparent', 
    color: isActive ? '#D4AF37' : '#fff', 
    border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontSize: '1rem'
});

export default AdminDashboard;
