const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    medicineName: { type: String, required: true },
    dosage: String,
    frequency: String,
    time: String,
    isActive: { type: Boolean, default: true },
    nextDose: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
