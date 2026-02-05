const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    doctor: String,
    hospital: String,
    date: String,
    size: Number,
    // Encrypted payload
    encryptedData: { type: String, required: true },
    iv: { type: String, required: true },
    salt: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Record = mongoose.model('Record', recordSchema);
module.exports = Record;
