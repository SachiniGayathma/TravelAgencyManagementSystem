const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomCategorySchema = new Schema({
    category: {
        type: String,
        required: true
    },
    charges: {
        type: Number,
        required: true
    }
}, { _id: false }); // _id: false prevents creation of an _id field for each room category

const propertySchema = new Schema({
    name: {
        type: String,
        required: true // backend validation
    },
    type: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    chargePerHead: {
        type: Number,
        required: true
    },
    winterCharge: {
        type: Number,
        required: true
    },
    summerCharge: {
        type: Number,
        required: true
    },
    adult2Sup: {
        type: Number,
        required: true
    },
    adult3Sup: {
        type: Number,
        required: true
    },
    minAgeFoc: {
        type: Number,
        required: true
    },
    maxAgeFoc: {
        type: Number,
        required: true
    },
    minAgeChargable: {
        type: Number,
        required: true
    },
    maxAgeChargable: {
        type: Number,
        required: true
    },
    childSup: {
        type: Number,
        required: true
    },
    breakSup: {
        type: Number,
        required: true
    },
    lunSup: {
        type: Number,
        required: true
    },
    dinSup: {
        type: Number,
        required: true
    },
    roomCategories: [roomCategorySchema], // Use the sub-schema for room categories
    imageUrls: [String] ,// Array of image URLs
    searchCount: { type: Number, default: 0 },  // New field to track search count
    lastSearched: { type: Date }                // New field to track the last search date

});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
