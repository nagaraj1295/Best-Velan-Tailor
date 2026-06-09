import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut, MessageCircle, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/api/orders/create`, formData);
            setInsertMsg('Order successfully created!');
            setFormData({ name: '', place: '', phone: '', materialName: '', status: 'Order Received' });
            fetchOrders();
            fetchCustomers();
            setTimeout(() => setInsertMsg(''), 4000);
        } catch (error) {
            setInsertMsg('Failed to create order. Phone number might be invalid.');
            setTimeout(() => setInsertMsg(''), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) { console.error("Update failed"); }
    };

    const handleDeleteOrder = async (orderId) => {
        if(window.confirm('Are you sure you want to delete this order permanently?')) {
            try {
                await axios.delete(`${API_URL}/api/orders/${orderId}`);
                fetchOrders();
            } catch (error) { console.error("Delete failed"); }
        }
    };

    const openWhatsApp = (phone, orderNumber, status) => {
        const message = encodeURIComponent(`Hello! Your order #${orderNumber} at Best Velan Tailors is currently: ${status}.`);
        window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
    };

    const getStatusClass = (status) => {
        if (status.includes('Received')) return 'status-received';
        if (status.includes('Cutting')) return 'status-cutting';
        if (status.includes('Stitching')) return 'status-stitching';
        if (status.includes('Ready')) return 'status-ready';
        return '';
    };

    const getTabTitle = () => {
        switch(activeTab) {
            case 'insert-order': return 'New Order';
            case 'view-orders': return 'All Orders';
            case 'customers': return 'Customers';
            case 'profile': return 'Settings';
            default: return 'Dashboard';
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'insert-order':
                return (
                    <div className="admin-content-card fade-up in-view">
                        <h2 className="admin-page-title">Create New Order</h2>
                        
                        {insertMsg && (
                            <div style={{ backgroundColor: insertMsg.includes('Failed') ? '#fee2e2' : '#dcfce7', color: insertMsg.includes('Failed') ? '#991b1b' : '#166534', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle2 size={20} />
                                <span style={{fontWeight: '600'}}>{insertMsg}</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleCreateOrder} className="app-form">
                            <div className="input-group">
                                <label>Customer Name</label>
                                <input type="text" className="app-input" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            
                            <div className="input-group">
                                <label>Mobile Number</label>
                                <input type="tel" className="app-input" placeholder="10-digit number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required maxLength="10" />
                            </div>

                            <div className="input-group">
                                <label>City / Place</label>
                                <input type="text" className="app-input" placeholder="e.g. Alanganallur" value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} required />
                            </div>
                            
                            <div className="input-group">
                                <label>Material Name</label>
                                <input type="text" className="app-input" placeholder="e.g. Raymond Cotton Shirt" value={formData.materialName} onChange={e => setFormData({...formData, materialName: e.target.value})} required />
                            </div>

                            <div className="input-group">
                                <label>Initial Status</label>
                                <select className="app-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="Order Received">Order Received</option>
                                    <option value="Cutting & Sizing">Cutting & Sizing</option>
                                    <option value="Stitching in Progress">Stitching in Progress</option>
                                    <option value="Ready for Pickup">Ready for Pickup</option>
                                </select>
                            </div>

                            <button type="submit" className="app-btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Order'}
                            </button>
                        </form>
                    </div>
                );
            case 'view-orders':
                return (
                    <div className="admin-content-card fade-up in-view">
                        <h2 className="admin-page-title">Manage Orders</h2>
                        <div className="table-container">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer Info</th>
                                        <th>Material</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No orders found. Create one first!</td></tr>
                                    ) : orders.map(order => (
                                        <tr key={order._id}>
                                            <td>
                                                <div style={{fontWeight: '700', color: '#0B1B3D'}}>{order.orderNumber}</div>
                                                <div style={{fontSize: '0.8rem', color: '#64748b'}}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <div style={{fontWeight: '600'}}>{order.customer?.name}</div>
                                                <div style={{fontSize: '0.85rem', color: '#64748b'}}>{order.customer?.phone}</div>
                                            </td>
                                            <td>{order.materialName}</td>
                                            <td>
                                                <select 
                                                    className={`app-input ${getStatusClass(order.status)}`}
                                                    style={{padding: '8px', border: 'none', cursor: 'pointer', fontWeight: '600'}}
                                                    value={order.status} 
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                >
                                                    <option value="Order Received">Received</option>
                                                    <option value="Cutting & Sizing">Cutting</option>
                                                    <option value="Stitching in Progress">Stitching</option>
                                                    <option value="Ready for Pickup">Ready</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div style={{display: 'flex', gap: '5px'}}>
                                                    <button className="action-btn" onClick={() => openWhatsApp(order.customer?.phone, order.orderNumber, order.status)} title="Notify via WhatsApp" style={{color: '#25D366'}}>
                                                        <MessageCircle size={20} />
                                                    </button>
                                                    <button className="action-btn" onClick={() => handleDeleteOrder(order._id)} title="Delete Order" style={{color: '#ef4444'}}>
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'customers':
                return (
                    <div className="admin-content-card fade-up in-view">
                        <h2 className="admin-page-title">Customer Directory</h2>
                        <div className="table-container">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Location</th>
                                        <th>Visits</th>
                                        <th>Last Visit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length === 0 ? (
                                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No customers found.</td></tr>
                                    ) : customers.map(c => (
                                        <tr key={c._id}>
                                            <td style={{fontWeight: '600', color: '#0B1B3D'}}>{c.name}</td>
                                            <td>{c.phone}</td>
                                            <td>{c.place}</td>
                                            <td>
                                                <span style={{backgroundColor: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem'}}>
                                                    {c.visitCount}
                                                </span>
                                            </td>
                                            <td style={{color: '#64748b'}}>{new Date(c.lastVisitDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="admin-content-card fade-up in-view" style={{maxWidth: '500px', margin: '0 auto'}}>
                        <div style={{textAlign: 'center', marginBottom: '30px'}}>
                            <div style={{width: '80px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px'}}>
                                <ShieldCheck size={40} color="#64748b" />
                            </div>
                            <h2 className="admin-page-title" style={{marginBottom: '5px'}}>Admin Settings</h2>
                            <p style={{color: '#64748b'}}>Manage your security credentials</p>
                        </div>
                        
                        <form className="app-form">
                            <div className="input-group">
                                <label>Username</label>
                                <input type="text" className="app-input" defaultValue="admin" disabled style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}} />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input type="password" className="app-input" placeholder="Enter new password" />
                            </div>
                            <button type="button" className="app-btn-primary" style={{marginTop: '20px'}}>Update Password</button>
                        </form>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            {/* Desktop Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-brand">Velan Admin</div>
                
                <nav className="admin-nav">
                    <button className={`admin-nav-btn ${activeTab === 'insert-order' ? 'active' : ''}`} onClick={() => setActiveTab('insert-order')}>
                        <PlusCircle size={20}/> New Order
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'view-orders' ? 'active' : ''}`} onClick={() => setActiveTab('view-orders')}>
                        <LayoutDashboard size={20}/> Manage Orders
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                        <Users size={20}/> Customers
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <Settings size={20}/> Settings
                    </button>
                </nav>

                <button className="admin-logout-btn" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}>
                    <LogOut size={20}/> Logout
                </button>
            </aside>

            {/* Mobile Bottom Navigation (App-like) */}
            <nav className="mobile-bottom-nav">
                <button className={`mobile-nav-item ${activeTab === 'insert-order' ? 'active' : ''}`} onClick={() => setActiveTab('insert-order')}>
                    <div className="mobile-icon-wrapper"><PlusCircle size={22} /></div>
                    <span>New</span>
                </button>
                <button className={`mobile-nav-item ${activeTab === 'view-orders' ? 'active' : ''}`} onClick={() => setActiveTab('view-orders')}>
                    <div className="mobile-icon-wrapper"><LayoutDashboard size={22} /></div>
                    <span>Orders</span>
                </button>
                <button className={`mobile-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                    <div className="mobile-icon-wrapper"><Users size={22} /></div>
                    <span>Clients</span>
                </button>
                <button className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    <div className="mobile-icon-wrapper"><Settings size={22} /></div>
                    <span>Profile</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="admin-main">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <div style={{fontFamily: 'Playfair Display', fontWeight: 'bold', fontSize: '1.2rem', color: '#0B1B3D'}}>
                        Velan <span style={{color: '#D4AF37'}}>Admin</span>
                    </div>
                    <div style={{fontWeight: '600', color: '#64748b'}}>
                        {getTabTitle()}
                    </div>
                    <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px'}}>
                        <LogOut size={20} />
                    </button>
                </div>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
