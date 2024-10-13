const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    VehicleNo: {
        type: String,
        required: true
    },
    CustomerName: {
        type: String,
        required: true
    },
    CustomerContact: {
        type: String,
        required: true
    },
    BookingDate: {
        type: Date,
        required: true
    },
    ReturnDate: {
        type: Date,
        required: true
    },
    BookingStatus: {
        type: String,
        default: "Booked"
    },
    FuelCost: {
        type: Number,
        default: 0
    },
    MaintenanceCost: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Bookings", bookingSchema);

module.exports = Booking;
