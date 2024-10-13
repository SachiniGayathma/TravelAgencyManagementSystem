const express = require("express");
const multer = require("multer");
const TourGuide = require("../models/TourGuide"); // Ensure this path is correct
const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify your upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
    }
});

const upload = multer({ storage: storage });

// Add a new tour guide with file upload
router.post("/add", upload.fields([{ name: 'license' }, { name: 'profilePicture' }]), async (req, res) => {
    const { name, nic, contactNo, languages, charge } = req.body;

    // Ensure req.body has the required fields
    if (!name || !nic || !contactNo || !charge || !languages || !req.files.license || !req.files.profilePicture) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const parsedLanguages = JSON.parse(languages); // Parse languages back to array

    const newTourGuide = new TourGuide({
        name,
        nic,
        contactNo,
        languages: parsedLanguages,
        charge,
        license: req.files.license[0].path, // Save the license path
        profilePicture: req.files.profilePicture[0].path // Save the profile picture path
    });

    try {
        await newTourGuide.save();
        res.status(201).json({ message: "Tour Guide added successfully!" });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error adding tour guide.", error: error.message });
    }
});


// Get all tour guides
router.route("/").get(async (req, res) => {
    try {
        const tourGuides = await TourGuide.find();
        res.json(tourGuides);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error fetching tour guides", error: err.message });
    }
});

// Update a tour guide
// Update a tour guide
router.route("/update/:id").put(upload.single("license"), async (req, res) => {
    const userId = req.params.id;
    const { name, nic, contactNo, languages, charge } = req.body;

    const updateTourGuide = {
        name,
        nic,
        contactNo,
        languages: Array.isArray(languages) ? languages : [languages], // Ensure it's an array
        charge,
        ...(req.file && { license: req.file.path }) // Update only if a new file is uploaded
    };

    try {
        const updatedGuide = await TourGuide.findByIdAndUpdate(userId, updateTourGuide, { new: true });
        res.status(200).send({ status: "Tour Guide updated", user: updatedGuide });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating data", error: err.message });
    }
});


// Delete a tour guide
router.route("/delete/:id").delete(async (req, res) => {
    const userId = req.params.id;

    try {
        await TourGuide.findByIdAndDelete(userId);
        res.status(200).send({ status: "Tour Guide deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with deleting Tour Guide", error: err.message });
    }
});

// Get a specific tour guide by ID
router.route("/get/:id").get(async (req, res) => {
    const userId = req.params.id;

    try {
        const tourGuide = await TourGuide.findById(userId);
        res.status(200).send({ status: "Tour Guide fetched", user: tourGuide });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching Tour Guide", error: err.message });
    }
});

// Search tour guides based on filters (name, languages, tour date)
router.route("/search").get(async (req, res) => {
    const { name, languages, tourDate } = req.query;

    const filters = {};
    if (name) filters.name = { $regex: name, $options: "i" }; // Case-insensitive name match
    if (languages) filters.languages = { $in: languages.split(",") }; // Split language string into array
    if (tourDate) filters.tourDate = tourDate; // Match tour date

    try {
        const tourGuides = await TourGuide.find(filters);
        res.json(tourGuides); // Return filtered tour guides
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error fetching filtered tour guides", error: err.message });
    }
});


module.exports = router;
