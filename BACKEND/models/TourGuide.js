const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nic: { type: String, required: true },
    contactNo: { type: String, required: true },
    languages: { type: [String], required: true },
    charge: { type: Number, required: true },
    license: { type: String }, // Added license field to save the file path
    profilePicture: { type: String } // Added profile picture field to save the file path

});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
module.exports = TourGuide;
