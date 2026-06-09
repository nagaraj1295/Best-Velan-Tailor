import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut, MessageCircle, Trash2, ShieldCheck, CheckCircle2, Edit2, Save, X, BarChart3, MessageSquare, TrendingUp, Calendar, Clock } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const navigate = useNavigate();

    // Form States
    const [formData, setFormData] = useState({ name: '', place: '', phone: '', materialName: '', status: 'Order Received' });
    const [insertMsg, setInsertMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit States
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editFormData, setEditFormData] = useState({ customerName: '', materialName: '', status: '' });

    // Profile States
    const [newPassword, setNewPassword] = useState('');
    const [profileMsg, setProfileMsg] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchOrders();
            fetchCustomers();
            fetchFeedbacks();
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

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/feedback`);
            setFeedbacks(res.data);
        } catch (error) { console.error("Error fetching feedbacks"); }
    };

    // ... [Handlers remain exactly the same: handleCreateOrder, startEditing, etc.]
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

    const startEditing = (order) => {
        setEditingOrderId(order._id);
        setEditFormData({
            customerName: order.customer?.name || '',
            materialName: order.materialName || '',
            status: order.status || 'Order Received'
        });
    };

    const cancelEditing = () => {
        setEditingOrderId(null);
        setEditFormData({ customerName: '', materialName: '', status: '' });
    };

    const handleSaveEdit = async (orderId) => {
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}`, editFormData);
            setEditingOrderId(null);
            fetchOrders();
            fetchCustomers();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update order details.");
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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if(!newPassword) return;
        try {
            await axios.put(`${API_URL}/api/auth/profile`, { password: newPassword });
            setProfileMsg('Password updated successfully!');
            setNewPassword('');
            setTimeout(() => setProfileMsg(''), 4000);
        } catch (error) {
            setProfileMsg('Failed to update password.');
            setTimeout(() => setProfileMsg(''), 4000);
        }
    };

    const getWhatsAppMessage = (order) => {
        const name = order.customer?.name || 'Customer';
        const num = order.orderNumber;
        const link = window.location.origin;
        
        switch(order.status) {
            case 'Order Received':
                return `Hello ${name}, your order #${num} at Best Velan Tailors has been received. Check your Order status instantly here: ${link}.\nThank you for choosing us!`;
            case 'Cutting & Sizing':
                return `Hello ${name}, your order #${num} is now in the cutting & sizing stage. Our team is working carefully on it.`;
            case 'Stitching in Progress':
                return `Hello ${name}, your order #${num} is currently being stitched. We’re crafting it with precision.`;
            case 'Ready for Pickup':
                return `Hello ${name}, your order #${num} is ready for pickup at Best Velan Tailors. We look forward to seeing you!\nFor any query fill your feedback here.`;
            default:
                return `Hello ${name}! Your order #${num} at Best Velan Tailors is currently: ${order.status}.`;
        }
    };

    const getStatusClass = (status) => {
        if (status.includes('Received')) return 'status-received';
        if (status.includes('Cutting')) return 'status-cutting';
        if (status.includes('Stitching')) return 'status-stitching';
        if (status.includes('Ready')) return 'status-ready';
        return '';
    };

    // Analytics Helpers
    const getOrderStats = () => {
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        
        let stats = {
            today: 0,
            weekly: 0,
            monthly: 0,
            yearly: 0,
            statusCounts: {
                'Order Received': 0,
                'Cutting & Sizing': 0,
                'Stitching in Progress': 0,
                'Ready for Pickup': 0
            }
        };

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const diffDays = Math.round(Math.abs((now - orderDate) / oneDay));

            if (diffDays === 0) stats.today++;
            if (diffDays <= 7) stats.weekly++;
            if (diffDays <= 30) stats.monthly++;
            if (diffDays <= 365) stats.yearly++;

            if (stats.statusCounts[order.status] !== undefined) {
                stats.statusCounts[order.status]++;
            }
        });

        return stats;
    };

    const getTabTitle = () => {
        switch(activeTab) {
            case 'analytics': return 'Dashboard Overview';
            case 'insert-order': return 'New Order';
            case 'view-orders': return 'Manage Orders';
            case 'customers': return 'Customers';
            case 'feedback': return 'Customer Feedback';
            case 'profile': return 'Settings';
            default: return 'Dashboard';
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'analytics':
                const stats = getOrderStats();
                const chartData = [
                    { name: 'Received', count: stats.statusCounts['Order Received'], color: '#0284c7' },
                    { name: 'Cutting', count: stats.statusCounts['Cutting & Sizing'], color: '#854d0e' },
                    { name: 'Stitching', count: stats.statusCounts['Stitching in Progress'], color: '#c2410c' },
                    { name: 'Ready', count: stats.statusCounts['Ready for Pickup'], color: '#15803d' },
                ];

                return (
                    <div className="fade-up in-view">
                        <h2 className="admin-page-title">Analytics & Dashboard</h2>
                        
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div className="admin-content-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ backgroundColor: '#e0f2fe', padding: '15px', borderRadius: '12px', color: '#0284c7' }}><Clock size={24} /></div>
                                <div><div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Today</div><div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0B1B3D' }}>{stats.today}</div></div>
                            </div>
                            <div className="admin-content-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ backgroundColor: '#fef08a', padding: '15px', borderRadius: '12px', color: '#854d0e' }}><TrendingUp size={24} /></div>
                                <div><div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Last 7 Days</div><div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0B1B3D' }}>{stats.weekly}</div></div>
                            </div>
                            <div className="admin-content-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ backgroundColor: '#ffedd5', padding: '15px', borderRadius: '12px', color: '#c2410c' }}><Calendar size={24} /></div>
                                <div><div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Last 30 Days</div><div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0B1B3D' }}>{stats.monthly}</div></div>
                            </div>
                            <div className="admin-content-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ backgroundColor: '#dcfce7', padding: '15px', borderRadius: '12px', color: '#15803d' }}><BarChart3 size={24} /></div>
                                <div><div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>This Year</div><div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0B1B3D' }}>{stats.yearly}</div></div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="admin-content-card" style={{ marginBottom: '30px' }}>
                            <h3 style={{ marginBottom: '20px', color: '#0B1B3D' }}>Orders by Status</h3>
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" allowDecimals={false} />
                                        <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );
            case 'feedback':
                return (
                    <div className="admin-content-card fade-up in-view">
                        <h2 className="admin-page-title">Customer Feedback</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {feedbacks.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No feedback received yet.</div>
                            ) : feedbacks.map(f => (
                                <div key={f._id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0B1B3D' }}>{f.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(f.createdAt).toLocaleDateString()} at {new Date(f.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                    <div style={{ color: '#334155', lineHeight: '1.6' }}>
                                        "{f.message}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
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
                                    ) : orders.map(order => {
                                        const isEditing = editingOrderId === order._id;
                                        return (
                                            <tr key={order._id}>
                                                <td>
                                                    <div style={{fontWeight: '700', color: '#0B1B3D'}}>{order.orderNumber}</div>
                                                    <div style={{fontSize: '0.8rem', color: '#64748b'}}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td>
                                                    {isEditing ? (
                                                        <input type="text" className="app-input" style={{padding: '6px', fontSize: '0.9rem', width: '100%'}} value={editFormData.customerName} onChange={e => setEditFormData({...editFormData, customerName: e.target.value})} />
                                                    ) : (
                                                        <>
                                                            <div style={{fontWeight: '600'}}>{order.customer?.name}</div>
                                                            <div style={{fontSize: '0.85rem', color: '#64748b'}}>{order.customer?.phone}</div>
                                                        </>
                                                    )}
                                                </td>
                                                <td>
                                                    {isEditing ? (
                                                        <input type="text" className="app-input" style={{padding: '6px', fontSize: '0.9rem', width: '100%'}} value={editFormData.materialName} onChange={e => setEditFormData({...editFormData, materialName: e.target.value})} />
                                                    ) : (
                                                        order.materialName
                                                    )}
                                                </td>
                                                <td>
                                                    {isEditing ? (
                                                        <select className="app-input" style={{padding: '6px', fontSize: '0.9rem', width: '100%'}} value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})}>
                                                            <option value="Order Received">Received</option>
                                                            <option value="Cutting & Sizing">Cutting</option>
                                                            <option value="Stitching in Progress">Stitching</option>
                                                            <option value="Ready for Pickup">Ready</option>
                                                        </select>
                                                    ) : (
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
                                                    )}
                                                </td>
                                                <td>
                                                    {isEditing ? (
                                                        <div style={{display: 'flex', gap: '5px'}}>
                                                            <button className="action-btn" onClick={() => handleSaveEdit(order._id)} title="Save Changes" style={{color: '#10b981', backgroundColor: '#d1fae5'}}><Save size={18} /></button>
                                                            <button className="action-btn" onClick={cancelEditing} title="Cancel" style={{color: '#ef4444', backgroundColor: '#fee2e2'}}><X size={18} /></button>
                                                        </div>
                                                    ) : (
                                                        <div style={{display: 'flex', gap: '5px'}}>
                                                            <button className="action-btn" onClick={() => startEditing(order)} title="Edit Order" style={{color: '#3b82f6'}}><Edit2 size={18} /></button>
                                                            <a href={`https://wa.me/91${order.customer?.phone}?text=${encodeURIComponent(getWhatsAppMessage(order))}`} target="_blank" rel="noopener noreferrer" className="action-btn" title="Notify via WhatsApp" style={{color: '#25D366', display: 'flex', alignItems: 'center'}}><MessageCircle size={18} /></a>
                                                            <button className="action-btn" onClick={() => handleDeleteOrder(order._id)} title="Delete Order" style={{color: '#ef4444'}}><Trash2 size={18} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
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
                        
                        {profileMsg && (
                            <div style={{ backgroundColor: profileMsg.includes('Failed') ? '#fee2e2' : '#dcfce7', color: profileMsg.includes('Failed') ? '#991b1b' : '#166534', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
                                {profileMsg}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="app-form">
                            <div className="input-group">
                                <label>Username</label>
                                <input type="text" className="app-input" defaultValue="admin" disabled style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}} />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input type="password" className="app-input" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength="6" />
                            </div>
                            <button type="submit" className="app-btn-primary" style={{marginTop: '20px'}}>Update Password</button>
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
                    <button className={`admin-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <BarChart3 size={20}/> Dashboard
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'insert-order' ? 'active' : ''}`} onClick={() => setActiveTab('insert-order')}>
                        <PlusCircle size={20}/> New Order
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'view-orders' ? 'active' : ''}`} onClick={() => setActiveTab('view-orders')}>
                        <LayoutDashboard size={20}/> Manage Orders
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                        <Users size={20}/> Customers
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                        <MessageSquare size={20}/> Feedback
                    </button>
                    <button className={`admin-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <Settings size={20}/> Settings
                    </button>
                </nav>

                <button className="admin-logout-btn" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}>
                    <LogOut size={20}/> Logout
                </button>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-bottom-nav">
                <button className={`mobile-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                    <div className="mobile-icon-wrapper"><BarChart3 size={22} /></div>
                    <span>Home</span>
                </button>
                <button className={`mobile-nav-item ${activeTab === 'insert-order' ? 'active' : ''}`} onClick={() => setActiveTab('insert-order')}>
                    <div className="mobile-icon-wrapper"><PlusCircle size={22} /></div>
                    <span>New</span>
                </button>
                <button className={`mobile-nav-item ${activeTab === 'view-orders' ? 'active' : ''}`} onClick={() => setActiveTab('view-orders')}>
                    <div className="mobile-icon-wrapper"><LayoutDashboard size={22} /></div>
                    <span>Orders</span>
                </button>
                <button className={`mobile-nav-item ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                    <div className="mobile-icon-wrapper"><MessageSquare size={22} /></div>
                    <span>Feedback</span>
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
