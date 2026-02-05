const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: { type: String, required: true }, // e.g., 'Heart Rate'
    value: { type: String, required: true },
    unit: { type: String, required: true },
    timestamp: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Vital = mongoose.model('Vital', vitalSchema);
module.exports = Vital;
