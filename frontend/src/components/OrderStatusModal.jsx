import React, { useState } from 'react';
import axios from 'axios';
import { X, Search, CheckCircle, Clock, Scissors, Package } from 'lucide-react';

const OrderStatusModal = ({ isOpen, onClose }) => {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [statusData, setStatusData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setStatusData(null);
        
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/orders/check-status`, { orderNumber, phone });
            setStatusData(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to find order. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Order Received', 'Cutting & Sizing', 'Stitching in Progress', 'Ready for Pickup'];
    const currentStepIndex = statusData ? steps.indexOf(statusData.order.status) : -1;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
            <div style={{
                background: '#fff', borderRadius: '12px', padding: '30px',
                width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px', 
                    background: 'none', border: 'none', cursor: 'pointer', color: '#666'
                }}>
                    <X size={24} />
                </button>

                <h2 style={{color: '#0B1B3D', marginBottom: '20px', fontFamily: 'Playfair Display', fontSize: '2rem'}}>Track Your Order</h2>
                
                {!statusData ? (
                    <form onSubmit={handleSearch} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333'}}>Order Number (12 Digits)</label>
                            <input 
                                type="text" 
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="e.g. 123456789012"
                                required
                                style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem'}}
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333'}}>Mobile Number</label>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 9698411561"
                                required
                                style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem'}}
                            />
                        </div>
                        
                        {error && <p style={{color: '#e74c3c', fontSize: '0.9rem', margin: 0}}>{error}</p>}
                        
                        <button type="submit" disabled={loading} style={{
                            backgroundColor: '#D4AF37', color: '#0B1B3D', border: 'none', padding: '14px',
                            borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                        }}>
                            {loading ? 'Searching...' : <><Search size={20} /> Check Status</>}
                        </button>
                    </form>
                ) : (
                    <div>
                        <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '25px'}}>
                            <p style={{margin: '0 0 5px 0'}}><strong>Customer:</strong> {statusData.customer.name}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Material:</strong> {statusData.order.materialName}</p>
                            <p style={{margin: 0}}><strong>Order ID:</strong> {statusData.order.orderNumber}</p>
                        </div>
                        
                        <div style={{position: 'relative', paddingLeft: '20px'}}>
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                
                                return (
                                    <div key={index} style={{display: 'flex', alignItems: 'flex-start', marginBottom: index === steps.length - 1 ? '0' : '25px', position: 'relative'}}>
                                        {/* Connecting Line */}
                                        {index !== steps.length - 1 && (
                                            <div style={{
                                                position: 'absolute', left: '11px', top: '24px', bottom: '-25px', width: '2px',
                                                backgroundColor: isCompleted ? '#D4AF37' : '#eee'
                                            }} />
                                        )}
                                        
                                        {/* Icon Node */}
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%', 
                                            backgroundColor: isCompleted ? '#D4AF37' : '#eee',
                                            color: isCompleted ? '#fff' : '#ccc',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                                            zIndex: 1, marginRight: '15px', flexShrink: 0, marginTop: '2px'
                                        }}>
                                            {isCompleted ? <CheckCircle size={14} /> : <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff'}} />}
                                        </div>
                                        
                                        {/* Step Text */}
                                        <div>
                                            <h4 style={{margin: 0, color: isCurrent ? '#0B1B3D' : (isCompleted ? '#333' : '#999'), fontSize: '1.1rem'}}>{step}</h4>
                                            {isCurrent && <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', color: '#D4AF37', fontWeight: 'bold'}}>Current Stage</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <button onClick={() => setStatusData(null)} style={{
                            width: '100%', backgroundColor: '#f0f0f0', color: '#333', border: 'none', padding: '12px',
                            borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px'
                        }}>
                            Check Another Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatusModal;
