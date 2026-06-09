const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_velan_tailor';

// Initialize default admin if none exists
const initializeAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({ username: 'admin', password: hashedPassword });
            console.log('Default admin created: admin / admin123');
        }
    } catch (err) {
        console.error('Notice: Could not connect to database to initialize admin. Ensure MongoDB is running.');
    }
};
initializeAdmin();

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, admin: { username: admin.username, profilePicture: admin.profilePicture } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Update Profile
router.put('/profile', async (req, res) => {
    try {
        // In a real app, protect this route with a JWT middleware
        const { id, username, password, profilePicture } = req.body;
        
        const admin = await Admin.findById(id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        
        if (username) admin.username = username;
        if (profilePicture) admin.profilePicture = profilePicture;
        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }
        
        await admin.save();
        res.status(200).json({ message: 'Profile updated successfully', admin: { username: admin.username, profilePicture: admin.profilePicture } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
