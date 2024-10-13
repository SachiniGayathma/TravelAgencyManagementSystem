import React, { useState } from 'react';
import axios from 'axios';
import './CreatePackage.css'; // Importing the CSS file

const CreatePackage = () => {
    const [packageName, setPackageName] = useState('');
    const [packagePrice, setPackagePrice] = useState('');
    const [numPassengers, setNumPassengers] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [services, setServices] = useState([]);
    const [numNights, setNumNights] = useState('');
    const [location, setLocation] = useState([]);
    const [accommodationType, setAccommodationType] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [languages, setLanguages] = useState([]); // State for selected languages
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const serviceOptions = [
        { id: 1, name: 'Accommodation' },
        { id: 2, name: 'Vehicle' },
        { id: 3, name: 'Tour Guide' },
    ];

    const locationOptions = [
        { id: 1, name: 'Colombo' },
        { id: 2, name: 'Kandy' },
        { id: 3, name: 'Galle' },
        { id: 4, name: 'Nuwara Eliya' },
        { id: 5, name: 'Ella' },
    ];

    const accommodationOptions = [
        { id: 1, name: 'Hotel' },
        { id: 2, name: 'Villa' },
        { id: 3, name: 'Apartment' },
        { id: 4, name: 'Guest House' },
    ];

    const vehicleOptions = [
        { id: 1, name: 'Car' },
        { id: 2, name: 'Bus' },
        { id: 3, name: 'Van' },
        { id: 4, name: 'Jeep' },
        { id: 5, name: 'Boat' },
        { id: 6, name: 'Caravan' },
        { id: 7, name: 'Motorbike' },
    ];

    const languageOptions = [
        { id: 1, name: 'English' },
        { id: 2, name: 'Spanish' },
        { id: 3, name: 'French' },
        { id: 4, name: 'German' },
        { id: 5, name: 'Mandarin' },
        { id: 6, name: 'Japanese' },
    ];

    const handleServiceChange = (e) => {
        const value = e.target.value;
        setServices((prev) =>
            prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
        );

        // Reset related states when services are unchecked
        if (value === 'Accommodation' && !services.includes(value)) {
            setAccommodationType('');
        }

        if (value === 'Vehicle' && !services.includes(value)) {
            setVehicleType(''); // Reset vehicle type if Vehicle service is unchecked
        }

        if (value === 'Tour Guide' && !services.includes(value)) {
            setLanguages([]); // Reset languages when Tour Guide is unchecked
        }
    };

    const handleLanguageChange = (e) => {
        const value = e.target.value;
        setLanguages((prev) =>
            prev.includes(value) ? prev.filter((lang) => lang !== value) : [...prev, value]
        );
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setLocation((prev) =>
            prev.includes(value) ? prev.filter((l) => l !== value) : [...prev, value]
        );
    };

    const handleAccommodationChange = (e) => {
        setAccommodationType(e.target.value);
    };

    const handleVehicleChange = (e) => {
        setVehicleType(e.target.value); // Update vehicle type
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPackage = {
            packageName,
            packagePrice: Number(packagePrice),
            numPassengers: Number(numPassengers),
            startDate,
            endDate,
            services,
            numNights: Number(numNights),
            location,
            accommodationType,
            vehicleType, // Include vehicle type in the package data
            languages, // Include selected languages
        };

        try {
            const response = await axios.post('http://localhost:8070/Package/packages', newPackage);
            console.log('Package created:', response.data);
            setSuccessMessage(`Package "${response.data.packageName}" created successfully!`); // Set success message
            // Optionally, clear the form after submission
            setPackageName('');
            setPackagePrice('');
            setNumPassengers('');
            setStartDate('');
            setEndDate('');
            setServices([]);
            setNumNights('');
            setLocation([]);
            setAccommodationType('');
            setVehicleType(''); // Reset vehicle type after submission
            setLanguages([]); // Reset languages after submission
        } catch (error) {
            console.error('Error creating package:', error);
        }
    };

    return (
        <div className="dennyFormContainer">
            <h2 className="dennyFormHeader">Create a New Package</h2>
            {successMessage && <div className="successMessage">{successMessage}</div>} {/* Display success message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="dennyLabel">Package Name:</label>
                    <input
                        className="dennyInput"
                        type="text"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="dennyLabel">Package Price:</label>
                    <input
                        className="dennyInput"
                        type="number"
                        value={packagePrice}
                        onChange={(e) => setPackagePrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="dennyLabel">Number of Passengers:</label>
                    <input
                        className="dennyInput"
                        type="number"
                        value={numPassengers}
                        onChange={(e) => setNumPassengers(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="dennyLabel">Start Date:</label>
                    <input
                        className="dennyInput"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="dennyLabel">End Date:</label>
                    <input
                        className="dennyInput"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className="dennyServicesSection">
                    <label className="dennyLabel">Services:</label>
                    {serviceOptions.map((service) => (
                        <div className="dennyCheckboxContainer" key={service.id}>
                            <input
                                type="checkbox"
                                value={service.name}
                                checked={services.includes(service.name)}
                                onChange={handleServiceChange}
                            />
                            <label className="dennyCheckboxLabel">{service.name}</label>
                        </div>
                    ))}
                </div>
                {services.includes('Accommodation') && (
                    <div className="dennyAccommodationSection">
                        <label className="dennyLabel">Accommodation Type:</label>
                        {accommodationOptions.map((acc) => (
                            <div className="dennyRadioContainer" key={acc.id}>
                                <input
                                    type="radio"
                                    value={acc.name}
                                    checked={accommodationType === acc.name}
                                    onChange={handleAccommodationChange}
                                />
                                <label className="dennyRadioLabel">{acc.name}</label>
                            </div>
                        ))}
                    </div>
                )}
                {services.includes('Vehicle') && (
                    <div className="dennyVehicleSection">
                        <label className="dennyLabel">Vehicle Type:</label>
                        <select
                            className="dennySelect"
                            value={vehicleType}
                            onChange={handleVehicleChange}
                            required
                        >
                            <option value="" disabled>Select Vehicle Type</option>
                            {vehicleOptions.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.name}>
                                    {vehicle.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {services.includes('Tour Guide') && (
                    <div className="dennyLanguageSection">
                        <label className="dennyLabel">Languages:</label>
                        {languageOptions.map((language) => (
                            <div className="dennyCheckboxContainer" key={language.id}>
                                <input
                                    type="checkbox"
                                    value={language.name}
                                    checked={languages.includes(language.name)}
                                    onChange={handleLanguageChange}
                                />
                                <label className="dennyCheckboxLabel">{language.name}</label>
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    <label className="dennyLabel">Number of Nights:</label>
                    <input
                        className="dennyInput"
                        type="number"
                        value={numNights}
                        onChange={(e) => setNumNights(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="dennyLabel">Location:</label>
                    {locationOptions.map((loc) => (
                        <div className="dennyCheckboxContainer" key={loc.id}>
                            <input
                                type="checkbox"
                                value={loc.name}
                                checked={location.includes(loc.name)}
                                onChange={handleLocationChange}
                            />
                            <label className="dennyCheckboxLabel">{loc.name}</label>
                        </div>
                    ))}
                </div>
                <button type="submit" className="dennySubmitButton">Create Package</button>
            </form>
        </div>
    );
};

export default CreatePackage;
