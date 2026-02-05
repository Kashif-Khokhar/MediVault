const express = require('express');
const router = express.Router();
const Vital = require('../models/Vital');
const { protect } = require('../middleware/authMiddleware');

// Get all user vitals
router.get('/', protect, async (req, res) => {
    try {
        const vitals = await Vital.find({ user: req.user._id }).sort({ timestamp: 1 });
        res.json(vitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new vital entry
router.post('/', protect, async (req, res) => {
    try {
        const vital = new Vital({
            ...req.body,
            user: req.user._id
        });
        const createdVital = await vital.save();
        res.status(201).json(createdVital);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
