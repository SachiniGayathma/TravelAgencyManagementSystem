const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName: {
        required: true,
        type: String,
    },
    packagePrice: {
        required: true,
        type: Number,
    },
    numPassengers: {
        required: true,
        type: Number,
    },
    startDate: {
        required: true,
        type: Date,
    },
    endDate: {
        required: true,
        type: Date,
    },
    services: {
        required: true,
        type: [String],
    },
    numNights: {
        required: true,
        type: Number,
    },
    location: {
        required: true,
        type: [String],
    },
    
});

// Creating model
const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
