const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/authMiddleware');

// Get all customers (Admin Panel)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ lastVisitDate: -1 });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

module.exports = router;
