const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/authMiddleware');

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
router.get('/', authMiddleware, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// Update Feedback Category
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { category } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, { category }, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Failed to update feedback category' });
    }
});

// Delete Feedback
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
});

module.exports = router;
