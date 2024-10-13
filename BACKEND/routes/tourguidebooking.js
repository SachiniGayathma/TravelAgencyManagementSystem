const express = require("express");
const router = express.Router();
const TourguideBooking = require("../models/TourguideBooking"); // Use consistent model name
const TourGuide = require("../models/TourGuide"); // TourGuide model

// Add a new booking
router.post("/add", async (req, res) => {
    const { tourGuideId, customerName, customerContact, tourDate, numberOfPeople } = req.body;

    try {
        // Find the tour guide by ID
        const tourGuide = await TourGuide.findById(tourGuideId);

        if (!tourGuide) {
            return res.status(404).json({ message: "Tour Guide not found." });
        }

        // Calculate the total charge based on the guide's charge per tour
        const totalCharge = numberOfPeople * tourGuide.charge;

        // Create a new booking
        const newBooking = new TourguideBooking({
            tourGuide: tourGuideId,
            customerName,
            customerContact,
            tourDate,
            numberOfPeople,
            totalCharge
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully!", booking: newBooking });
    } catch (err) {
        res.status(500).json({ message: "Error creating booking.", error: err.message });
    }
});

// Get all bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await TourguideBooking.find().populate("tourGuide"); // Populate the tour guide details
        res.json(bookings);
    } catch (err) {
        res.status(500).send({ status: "Error fetching bookings", error: err.message });
    }
});

// Update booking by ID
router.put("/:id", async (req, res) => {
    const { customerName, customerContact, tourDate, numberOfPeople } = req.body;

    try {
        const booking = await TourguideBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        booking.customerName = customerName;
        booking.customerContact = customerContact;
        booking.tourDate = tourDate;
        booking.numberOfPeople = numberOfPeople;

        await booking.save();
        res.status(200).json({ message: "Booking updated successfully!", booking });
    } catch (err) {
        res.status(500).json({ message: "Error updating booking.", error: err.message });
    }
});

// Delete a booking
router.delete("/delete/:id", async (req, res) => {
    try {
        await TourguideBooking.findByIdAndDelete(req.params.id);
        res.status(200).send({ status: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "Error deleting booking", error: err.message });
    }
});

module.exports = router;
