// routes/Vehicles.js
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const path = require('path');
const fs = require('fs');

// Endpoint to add a vehicle with an image
router.post('/add', (req, res) => {
    const { VehicleNo, VehicleBrand, VehicleModel, VehicleManufactureYear, NumberOfSeats, VehicleStatus, VehicleFuel, VehicleSunroof, VehicleBootCapacity, VehicleRate, VehicleOFFRoad } = req.body;
    let VehicleImage = '';

    // Convert boolean fields to actual boolean values
    const parsedVehicleSunroof = VehicleSunroof === 'true';
    const parsedVehicleOFFRoad = VehicleOFFRoad === 'true';

    if (req.files && req.files.VehicleImage) {
        const file = req.files.VehicleImage;
        VehicleImage = `uploads/${file.name}`;
        const uploadPath = path.join(__dirname, '../uploads');

        // Check if uploads directory exists, and create it if not
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Move the uploaded file to the desired directory
        file.mv(path.join(uploadPath, file.name), (err) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(500).send('File upload failed');
            }

            // Create a new vehicle instance
            const newVehicle = new Vehicle({
                VehicleNo,
                VehicleBrand,
                VehicleModel,
                VehicleManufactureYear,
                NumberOfSeats,
                VehicleStatus,
                VehicleFuel,
                VehicleSunroof: parsedVehicleSunroof,
                VehicleBootCapacity,
                VehicleRate,
                VehicleOFFRoad: parsedVehicleOFFRoad,
                VehicleImage
            });

            // Save the vehicle to the database
            newVehicle.save()
                .then(() => res.json("Vehicle Added"))
                .catch((err) => {
                    console.error("Error saving vehicle:", err);
                    res.status(400).json("Error: " + err.message);
                });
        });
    } else {
        // Create a new vehicle instance without an image
        const newVehicle = new Vehicle({
            VehicleNo,
            VehicleBrand,
            VehicleModel,
            VehicleManufactureYear,
            NumberOfSeats,
            VehicleStatus,
            VehicleFuel,
            VehicleSunroof: parsedVehicleSunroof,
            VehicleBootCapacity,
            VehicleRate,
            VehicleOFFRoad: parsedVehicleOFFRoad,
        });

        // Save the vehicle to the database
        newVehicle.save()
            .then(() => res.json("Vehicle Added"))
            .catch((err) => {
                console.error("Error saving vehicle:", err);
                res.status(400).json("Error: " + err.message);
            });
    }
});

// Endpoint to fetch all vehicles
router.get("/", (req, res) => {
    Vehicle.find().then((vehicles) => {
        res.json(vehicles);
    }).catch((err) => {
        console.error("Error fetching vehicles:", err);
        res.status(500).json("Error: " + err.message);
    });
});

// Update a vehicle by vehicle number
router.put('/updateByVehicleNo/:vehicleNo', async (req, res) => {
    try {
        const vehicleNo = req.params.vehicleNo;
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { VehicleNo: vehicleNo },
            req.body,
            { new: true }
        );
        if (!updatedVehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        res.json(updatedVehicle);
    } catch (err) {
        console.error("Error updating vehicle:", err);
        res.status(400).json({ error: err.message });
    }
});

// Delete a vehicle by vehicle number
router.delete('/deleteByVehicleNo/:vehicleNo', async (req, res) => {
    try {
        const vehicleNo = req.params.vehicleNo;
        const result = await Vehicle.findOneAndDelete({ VehicleNo: vehicleNo });

        if (!result) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
