const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit Feedback (Customer Public Site)
router.post('/', async (req, res) => {
    try {
        const { name, message } = req.body;
        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }
        
        const newFeedback = new Feedback({ name, message });
        await newFeedback.save();
        
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get all Feedback (Admin Panel)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

module.exports = router;
