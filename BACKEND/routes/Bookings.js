const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/add', (req, res) => {
    const { VehicleNo, BookingDate, ReturnDate } = req.body;

    // Convert BookingDate and ReturnDate to Date objects
    const bookingStart = new Date(BookingDate);
    const bookingEnd = new Date(ReturnDate);

    // Check if any booking exists that overlaps with the new booking dates
    Booking.findOne({
        VehicleNo: VehicleNo,
        $or: [
            { BookingDate: { $lte: bookingEnd }, ReturnDate: { $gte: bookingStart } }
        ]
    })
    .then(existingBooking => {
        if (existingBooking) {
            return res.status(400).json("Vehicle is already booked for the selected date range.");
        }

        // If no existing booking, create a new booking
        const newBooking = new Booking(req.body);
        newBooking.save()
            .then(() => res.json('Booking added!'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});


// Route to get all bookings
router.get('/', (req, res) => {
    Booking.find()
        .then(bookings => res.json(bookings))
        .catch(err => res.status(400).json("Error: " + err));
});

// Route to get a booking by ID
router.get('/:id', (req, res) => {
    Booking.findById(req.params.id)
        .then(booking => {
            if (!booking) return res.status(404).json("Booking not found");
            res.json(booking);
        })
        .catch(err => res.status(400).json("Error: " + err));
});

// Route to update a booking by ID
// Route to update a booking by ID
router.put('/update/:id', (req, res) => {
    Booking.findByIdAndUpdate(req.params.id, {
        ...req.body,
        lastUpdated: Date.now()
    }, { new: true })
        .then(updatedBooking => res.json(updatedBooking))
        .catch(err => res.status(400).json("Error: " + err));
});


// Route to delete a booking by ID
router.delete('/delete/:id', (req, res) => {
    Booking.findByIdAndDelete(req.params.id)
        .then(deletedBooking => {
            if (!deletedBooking) return res.status(404).json("Booking not found");
            res.json("Booking Deleted");
        })
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
