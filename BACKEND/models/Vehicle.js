// models/Vehicle.js
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    VehicleNo: { type: String, required: true, unique: true },
    VehicleBrand: String,
    VehicleModel: String,
    VehicleManufactureYear: Number,
    NumberOfSeats: Number,
    VehicleStatus: String,
    VehicleFuel: String,
    VehicleSunroof: Boolean,
    VehicleBootCapacity: String,
    VehicleRate: String,
    VehicleOFFRoad: Boolean,
    VehicleImage: String // This will store the filename of the uploaded image
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
