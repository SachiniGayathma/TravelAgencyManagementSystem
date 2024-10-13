const mongoose = require("mongoose");

const tourguidebookingSchema = new mongoose.Schema({
    tourGuide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TourGuide", // Reference to the TourGuide model
        required: true
    },
    customerName: { type: String, required: true },
    customerContact: { type: String, required: true },
    tourDate: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true },
    totalCharge: { type: Number, required: true }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const TourguideBooking = mongoose.model("TourguideBooking", tourguidebookingSchema);

module.exports = TourguideBooking;
