const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/authMiddleware');

// Get all user reminders
router.get('/', protect, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user._id });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new reminder
router.post('/', protect, async (req, res) => {
    try {
        const reminder = new Reminder({
            ...req.body,
            user: req.user._id
        });
        const createdReminder = await reminder.save();
        res.status(201).json(createdReminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete reminder
router.delete('/:id', protect, async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (reminder) {
            if (reminder.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await reminder.deleteOne();
            res.json({ message: 'Reminder removed' });
        } else {
            res.status(404).json({ message: 'Reminder not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
