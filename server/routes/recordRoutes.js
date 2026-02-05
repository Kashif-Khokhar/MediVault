const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { protect } = require('../middleware/authMiddleware');

// Get all user records
router.get('/', protect, async (req, res) => {
    try {
        const records = await Record.find({ user: req.user._id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new record
router.post('/', protect, async (req, res) => {
    try {
        const record = new Record({
            ...req.body,
            user: req.user._id
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a record
router.delete('/:id', protect, async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (record) {
            if (record.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await record.deleteOne();
            res.json({ message: 'Record removed' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
