const router = require("express").Router();
const Property = require("../models/Property");
const upload = require("../middleware/uploadMiddlewear");
const cloudinary = require("../config/cloudinaryConfig");

// Helper function to extract public ID from URL
const extractPublicId = (url) => url.split('/').pop().split('.')[0];

// Add a property with image upload
router.post("/add", upload.array('images', 5), async (req, res) => {
    const {
        name, type, destination, chargePerHead, winterCharge, summerCharge, 
        adult2Sup, adult3Sup, minAgeFoc, maxAgeFoc, minAgeChargable, 
        maxAgeChargable, childSup, breakSup, lunSup, dinSup, roomCategories
    } = req.body;

    let parsedRoomCategories;
    try {
        parsedRoomCategories = Array.isArray(roomCategories) ? roomCategories : JSON.parse(roomCategories);
    } catch (error) {
        return res.status(400).json({ error: "Invalid roomCategories format" });
    }

    // Collect the uploaded image URLs from Cloudinary
    const imageUrls = req.files.map(file => file.path);

    const newProperty = new Property({
        name,
        type,
        destination,
        chargePerHead,
        winterCharge,
        summerCharge,
        adult2Sup,
        adult3Sup,
        minAgeFoc,
        maxAgeFoc,
        minAgeChargable,
        maxAgeChargable,
        childSup,
        breakSup,
        lunSup,
        dinSup,
        roomCategories: parsedRoomCategories,
        imageUrls // Store the image URLs in the database
    });

    try {
        await newProperty.save();
        res.json("Property Added Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a property with image upload
router.put("/update/:id", upload.array('images', 5), async (req, res) => {
    const propertyId = req.params.id;
    const {
        name, type, destination, chargePerHead, winterCharge, summerCharge, 
        adult2Sup, adult3Sup, minAgeFoc, maxAgeFoc, minAgeChargable, 
        maxAgeChargable, childSup, breakSup, lunSup, dinSup, roomCategories
    } = req.body;

    let parsedRoomCategories;
    try {
        parsedRoomCategories = Array.isArray(roomCategories) ? JSON.parse(roomCategories) : JSON.parse(roomCategories);
    } catch (error) {
        return res.status(400).json({ error: "Invalid roomCategories format" });
    }

    // Collect the uploaded image URLs from Cloudinary (if images are uploaded)
    const imageUrls = req.files.length ? req.files.map(file => file.path) : undefined;

    const updateProperty = {
        name,
        type,
        destination,
        chargePerHead,
        winterCharge,
        summerCharge,
        adult2Sup,
        adult3Sup,
        minAgeFoc,
        maxAgeFoc,
        minAgeChargable,
        maxAgeChargable,
        childSup,
        breakSup,
        lunSup,
        dinSup,
        roomCategories: parsedRoomCategories,
    };

    // Only update imageUrls if new images were uploaded
    if (imageUrls) {
        updateProperty.imageUrls = imageUrls;
    }

    try {
        const updatedProperty = await Property.findByIdAndUpdate(propertyId, updateProperty, { new: true });
        if (!updatedProperty) {
            return res.status(404).json({ error: "Property Not Found" });
        }
        res.json("Property Updated Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Retrieve all properties
router.get("/", async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/get/:id', async (req, res) => {
    const propertyId = req.params.id;

    try {
        const property = await Property.findByIdAndUpdate(propertyId, {
            $inc: { searchCount: 1 },             // Increment search count
            $set: { lastSearched: new Date() }    // Update last searched time
        }, { new: true });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Delete a property and its images from Cloudinary
router.delete("/delete/:id", async (req, res) => {
    const propertyId = req.params.id;

    try {
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property Not Found" });
        }

        // Extract the public IDs from Cloudinary URLs and delete images
        const imageUrls = property.imageUrls;
        if (imageUrls && imageUrls.length > 0) {
            for (let url of imageUrls) {
                const publicId = extractPublicId(url); // Extract the public ID
                await cloudinary.uploader.destroy(`properties/${publicId}`); // Delete image from Cloudinary
            }
        }

        await Property.findByIdAndDelete(propertyId);
        res.json("Property Deleted Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/check', async (req, res) => {
    const { name, type, destination } = req.body;

    try {
        const existingProperty = await Property.findOne({ name, type, destination });
        if (existingProperty) {
            return res.status(409).json({
                message: `Property Listed Already: ${existingProperty.name} in ${existingProperty.destination} as a ${existingProperty.type}`,
            });
        }
        res.status(200).json({ message: 'Property not listed' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking property', error });
    }
});

router.get('/admin/propertycounts', async (req, res) => {
    try {
        const counts = await Property.aggregate([
            {
                $group: {
                    _id: { $toLower: "$type" }, // Normalize the type to lowercase
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialize the result object with default values
        const result = {
            hotel: 0,
            villa: 0,
            apartment: 0,
            guestHouse: 0
        };

        // Loop through the aggregated counts and map them to the result
        counts.forEach(item => {
            switch (item._id) {
                case 'hotel':
                    result.hotel = item.count;
                    break;
                case 'villa':
                    result.villa = item.count;
                    break;
                case 'apartment':
                    result.apartment = item.count;
                    break;
                case 'guesthouse':
                case 'guest house': // handle variations in how guest house is stored
                    result.guestHouse = item.count;
                    break;
                default:
                    console.warn(`Unknown property type: ${item._id}`);
            }
        });

        console.log("Property counts:", result); // Optional: Log the result on the backend
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching property counts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/properties/:location', async (req, res) => {
    const { location } = req.params;
    try {
        const properties = await Property.find({ destination: location });
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties for location', error });
    }
});

router.get('/mostsearched', async (req, res) => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    try {
        const properties = await Property.find({
            lastSearched: { $gte: fiveDaysAgo }   // Properties searched in the last 5 days
        }).sort({ searchCount: -1 })              // Sort by search count in descending order
          .limit(10);                             // Limit to top 10 results (adjust as needed)

        res.status(200).json(properties);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching most searched properties', error: err });
    }
});



module.exports = router;
