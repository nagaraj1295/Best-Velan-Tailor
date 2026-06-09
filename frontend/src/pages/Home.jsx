import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderStatusModal from '../components/OrderStatusModal';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState({ name: '', message: '' });
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Animation logic
        const elements = document.querySelectorAll('.fade-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/feedback`, feedback);
            setFeedbackMsg('Thank you! Your feedback has been submitted successfully.');
            setFeedback({ name: '', message: '' });
            setTimeout(() => setFeedbackMsg(''), 5000);
        } catch (error) {
            setFeedbackMsg('Failed to submit feedback. Please try again.');
            setTimeout(() => setFeedbackMsg(''), 5000);
        }
    };

    return (
        <div>
            <header className="header">
                <div className="container nav-container">
                    <a href="#" className="logo">
                        <img src="/assets/logo.webp" alt="Best Velan Tailors Logo" id="brand-logo" onError={(e) => { e.target.style.display='none'; document.getElementById('text-logo').style.display='block'; }} />
                        <span id="text-logo" style={{display: 'none'}}>Best Velan <span className="highlight">Tailors</span></span>
                    </a>
                    <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            <li><a href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</a></li>
                            <li><a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</a></li>
                            <li><a href="#why-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>Why Choose Us</a></li>
                            <li className="nav-call-btn"><a href="tel:9698411561" className="btn-primary nav-btn">Call Now</a></li>
                        </ul>
                    </nav>
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section id="home" className="hero">
                    <div className="container hero-content">
                        <div className="hero-text fade-up">
                            <h1 className="hero-title">
                                <span className="font-light">Perfect Fit</span> <br />
                                <span className="highlight">Quality Stitching</span>
                            </h1>
                            <p className="hero-subtitle">Clothing Design & Alteration Experts in Alanganallur. <br/>We offer the best luxury outfits and experiences for all ages.</p>
                            <div className="hero-buttons">
                                <a href="#services" className="btn-secondary">Our Services</a>
                                <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{cursor: 'pointer'}}>Order Status</button>
                                <a href="tel:9698411561" className="btn-secondary mobile-only-btn">Call Now</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="services section-padding">
                    <div className="container">
                        <div className="section-header fade-up">
                            <h2 className="section-title">Our <span className="highlight">Services</span></h2>
                            <p className="section-desc">Expert tailoring tailored to your unique style and needs.</p>
                        </div>
                        <div className="services-grid">
                            <div className="service-card fade-up delay-1">
                                <i className="fa-solid fa-shirt service-icon"></i>
                                <h3>Men's Shirt Stitching</h3>
                                <p>Custom tailored shirts designed for a perfect and comfortable fit.</p>
                            </div>
                            <div className="service-card fade-up delay-2">
                                <i className="fa-solid fa-user-tie service-icon"></i>
                                <h3>Men's Pant Stitching</h3>
                                <p>Premium trousers and pants stitched with high-quality craftsmanship.</p>
                            </div>
                            <div className="service-card fade-up delay-3">
                                <i className="fa-solid fa-graduation-cap service-icon"></i>
                                <h3>School Uniforms</h3>
                                <p>Durable and perfectly fitted school uniforms for boys and girls.</p>
                            </div>
                            <div className="service-card fade-up delay-4">
                                <i className="fa-solid fa-scissors service-icon"></i>
                                <h3>Alteration Services</h3>
                                <p>Expert pant and shirt alterations to breathe new life into your wardrobe.</p>
                            </div>
                            <div className="service-card fade-up delay-5">
                                <i className="fa-solid fa-users service-icon"></i>
                                <h3>Bulk & Group Orders</h3>
                                <p>Special offers and dedicated service for large group shirt and pant orders.</p>
                            </div>
                            <div className="service-card fade-up delay-6">
                                <i className="fa-solid fa-tape service-icon"></i>
                                <h3>Custom Tailoring</h3>
                                <p>Bespoke luxury outfits and package shirts customized exactly to your liking.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section id="why-us" className="why-us section-padding">
                    <div className="container">
                        <div className="why-us-content">
                            <div className="why-us-text fade-up">
                                <h2 className="section-title">Why <span className="highlight">Choose Us?</span></h2>
                                <p className="section-desc">We deliver the perfect stitching for your perfect style.</p>
                                <ul className="features-list">
                                    <li className="fade-up delay-1">
                                        <i className="fa-solid fa-check-circle"></i>
                                        <div>
                                            <h4>High Quality Stitching</h4>
                                            <p>Attention to detail in every seam and thread.</p>
                                        </div>
                                    </li>
                                    <li className="fade-up delay-2">
                                        <i className="fa-solid fa-check-circle"></i>
                                        <div>
                                            <h4>Reasonable Price</h4>
                                            <p>Premium quality tailoring that remains affordable.</p>
                                        </div>
                                    </li>
                                    <li className="fade-up delay-3">
                                        <i className="fa-solid fa-check-circle"></i>
                                        <div>
                                            <h4>On-Time Delivery Guarantee</h4>
                                            <p>Your orders delivered exactly on the promised date and time.</p>
                                        </div>
                                    </li>
                                    <li className="fade-up delay-4">
                                        <i className="fa-solid fa-check-circle"></i>
                                        <div>
                                            <h4>Perfect Fitting</h4>
                                            <p>Measurements taken with precision for a flawless look.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feedback Section */}
                <section id="feedback" className="feedback section-padding" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="container">
                        <div className="section-header fade-up">
                            <h2 className="section-title">Leave Your <span className="highlight">Feedback</span></h2>
                            <p className="section-desc">We value your opinion! Let us know how we did.</p>
                        </div>
                        <div className="feedback-form-wrapper fade-up delay-1" style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            {feedbackMsg && (
                                <div style={{ backgroundColor: feedbackMsg.includes('Failed') ? '#fee2e2' : '#dcfce7', color: feedbackMsg.includes('Failed') ? '#991b1b' : '#166534', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
                                    {feedbackMsg}
                                </div>
                            )}
                            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>Your Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={feedback.name}
                                        onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontFamily: 'inherit' }}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>Your Message</label>
                                    <textarea 
                                        required 
                                        value={feedback.message}
                                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontFamily: 'inherit', minHeight: '120px', resize: 'vertical' }}
                                        placeholder="Tell us about your experience..."
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1.1rem', cursor: 'pointer' }}>Submit Feedback</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer id="contact" className="footer">
                <div className="container footer-container">
                    <div className="footer-info">
                        <h3>Best Velan <span className="highlight">Tailors</span></h3>
                        <p>Your trusted tailoring partner in Alanganallur.</p>
                    </div>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <i className="fa-solid fa-phone"></i>
                            <div>
                                <h4>Call Us Now</h4>
                                <a href="tel:9698411561" className="phone-link">9698411561</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <i className="fa-solid fa-location-dot"></i>
                            <div>
                                <h4>Shop Address</h4>
                                <p>Busstand opposite,<br/>Alanganallur.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Best Velan Tailors. All Rights Reserved.</p>
                </div>
            </footer>

            {/* Order Status Modal */}
            <OrderStatusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Home;
