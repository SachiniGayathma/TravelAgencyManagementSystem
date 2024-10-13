const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Create a new package without image upload
// Create a new package without image upload
router.post('/packages', async (req, res) => {
    console.log('Body:', req.body);  // Log the incoming data from the request

    // Extracting body parameters
    const {
        packageName,
        packagePrice,
        numPassengers,
        startDate,
        endDate,
        services, // Keep it as an array
        numNights,
        location, // Change from 'locations' to 'location'
        vehicleOptions,
        accommodationOptions,
    } = req.body;

    try {
        const newPackage = new Package({
            packageName,
            packagePrice,
            numPassengers,
            startDate,
            endDate,
            services, // Use the services array directly
            numNights,
            location: location || [], // Use 'location' instead of 'locations'
            vehicleOptions: vehicleOptions ? vehicleOptions : [], // Ensure vehicle options are arrays
            accommodationOptions: accommodationOptions ? accommodationOptions : [] // Ensure accommodation options are arrays
        });

        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        console.error('Error saving package:', error);
        res.status(500).json({ error: 'Failed to create package' });
    }
});


// Get all packages with optional search functionality
router.get('/packages', async (req, res) => {
    try {
        const { query } = req.query;

        let packages;
        if (query) {
            packages = await Package.find({
                $or: [
                    { packageName: { $regex: query, $options: "i" } },
                    { services: { $regex: query, $options: "i" } },
                    { location: { $regex: query, $options: "i" } }
                ]
            });
        } else {
            packages = await Package.find();
        }

        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Error fetching packages' });
    }
});

// Update a package
router.put('/packages/:id', async (req, res) => {
    try {
        const { packageName, packagePrice, numPassengers, startDate, endDate, services, numNights, location } = req.body;
        const id = req.params.id;

        // Use findByIdAndUpdate with { new: true } to return the updated package
        const updatedPackage = await Package.findByIdAndUpdate(id, {
            packageName,
            packagePrice,
            numPassengers,
            startDate,
            endDate,
            services,
            numNights,
            location
        }, { new: true });

        if (updatedPackage) {
            res.status(200).json(updatedPackage);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ message: 'Error updating package' });
    }
});

// Delete a package
router.delete('/packages/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedPackage = await Package.findByIdAndDelete(id);

        if (deletedPackage) {
            res.status(200).json({ message: 'Package deleted successfully' });
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ message: 'Error deleting package' });
    }
});

module.exports = router;
