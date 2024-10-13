const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload");
const path = require("path");

// Initialize express and dotenv
const app = express();
dotenv.config();

// Set the port from environment variable or default to 8070
const PORT = process.env.PORT || 8070;

// Middleware (Sachini)
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Database URL from environment variable
const URL = process.env.MONGODB_URL;

// MongoDB connection setup
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB Connected Successfully");
}).catch((error) => {
    console.error("MongoDB connection failed:", error.message || error);
});

// Routes
const vehicleRouter = require("./routes/Vehicles");
app.use("/Vehicle", vehicleRouter);

const bookingRouter = require('./routes/Bookings');
app.use('/Booking', bookingRouter);

const packageRouter = require('./routes/Packages');
app.use('/Package', packageRouter);

const propertyRouter = require("./routes/Properties.js");
app.use("/property", propertyRouter);

const tourGuideRouter = require("./routes/tourguides.js");
app.use("/tourguide", tourGuideRouter);

const bookingRoutes = require("./routes/tourguidebooking.js"); 
app.use("/tourguidebooking", bookingRoutes); 



app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to handle email sending with PDF attachment
app.post('/send-email', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const { recipientEmail, subject } = req.body; // Get recipient and subject

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail, // Use the recipient's email from the request
        subject: subject || 'Vehicle Booking Report', // Use provided subject or default
        text: 'Please find the attached PDF report.',
        attachments: [
            {
                filename: file.name,
                content: file.data,
                encoding: 'base64'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start the server:', err.message);
});

