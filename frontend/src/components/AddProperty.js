import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';

const AddProperty = () => {
    const { handleSubmit, register, watch } = useForm();
    const [files, setFiles] = useState([]);
    const [roomCategories, setRoomCategories] = useState([{ category: '', charges: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [addedPropertyName, setAddedPropertyName] = useState('');
    const [checkMessage, setCheckMessage] = useState('');
    const [formVisible, setFormVisible] = useState(false);

    const propertyTypes = ['Hotel', 'Villa', 'Apartment', 'Guesthouse', 'Resort'];
    const sriLankanLocations = [
        'Colombo', 'Kandy', 'Galle', 'Matara', 'Negombo', 'Jaffna', 
        'Trincomalee', 'Anuradhapura', 'Nuwara Eliya', 'Sigiriya', 'Ella'
    ];

    const checkIfPropertyListed = async () => {
        const name = watch('name');
        const type = watch('type');
        const destination = watch('destination');

        if (!name || !type || !destination) {
            setCheckMessage('Please enter all required fields: Property Name, Type, and Location');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8070/property/check', {
                name,
                type,
                destination
            });

            if (response.status === 200) {
                setCheckMessage('Property not listed. You may proceed.');
                setFormVisible(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setCheckMessage(error.response.data.message);
                setFormVisible(false);
            } else {
                setCheckMessage('Error checking property. Please try again.');
            }
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('type', data.type);
        formData.append('destination', data.destination);
        formData.append('chargePerHead', data.chargePerHead);
        formData.append('winterCharge', data.winterCharge);
        formData.append('summerCharge', data.summerCharge);
        formData.append('adult2Sup', data.adult2Sup);
        formData.append('adult3Sup', data.adult3Sup);
        formData.append('minAgeFoc', data.minAgeFoc);
        formData.append('maxAgeFoc', data.maxAgeFoc);
        formData.append('minAgeChargable', data.minAgeChargable);
        formData.append('maxAgeChargable', data.maxAgeChargable);
        formData.append('childSup', data.childSup);
        formData.append('breakSup', data.breakSup);
        formData.append('lunSup', data.lunSup);
        formData.append('dinSup', data.dinSup);
        formData.append('roomCategories', JSON.stringify(roomCategories));
        files.forEach(file => formData.append('images', file));

        try {
            const response = await axios.post('http://localhost:8070/property/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAddedPropertyName(data.name);
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error adding property:', error);
            setIsLoading(false);
            alert('Failed to add property');
        }
    };

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleRoomCategoryChange = (index, event) => {
        const { name, value } = event.target;
        const newRoomCategories = [...roomCategories];
        newRoomCategories[index] = { ...newRoomCategories[index], [name]: value };
        setRoomCategories(newRoomCategories);
    };

    const addRoomCategory = () => {
        setRoomCategories([...roomCategories, { category: '', charges: '' }]);
    };

    const removeRoomCategory = (index) => {
        const newRoomCategories = roomCategories.filter((_, i) => i !== index);
        setRoomCategories(newRoomCategories);
    };

    return (
        <div className={`add-property-container ${isLoading || success ? 'blur-background' : ''}`}>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {success && (
                <div className="success-overlay">
                    <div className="tick-icon">✔</div>
                    <p>{addedPropertyName} added successfully!</p>
                </div>
            )}

            <h2>Add Property</h2>

            <div>
                <label>Enter Property Name</label>
                <input {...register('name', { required: true })} />

                <label>Select Property Type</label>
                <select {...register('type', { required: true })}>
                    <option value="">Select a type</option>
                    {propertyTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>

                <label>Select Location</label>
                <select {...register('destination', { required: true })}>
                    <option value="">Select a location</option>
                    {sriLankanLocations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>

                <button type="button" onClick={checkIfPropertyListed}>Check Property</button>
                {checkMessage && <p>{checkMessage}</p>}
            </div>

            {formVisible && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Charge Per Head</label>
                    <input type="number" {...register('chargePerHead', { required: true })} />

                    <label>Winter Charges</label>
                    <input type="number" {...register('winterCharge', { required: true })} />

                    <label>Summer Charges</label>
                    <input type="number" {...register('summerCharge', { required: true })} />

                    <label>Additional charges for 2nd Adult</label>
                    <input type="number" {...register('adult2Sup', { required: true })} />

                    <label>Additional Charges for 3rd Adult</label>
                    <input type="number" {...register('adult3Sup', { required: true })} />

                    <label>Minimum Age Of a Child FOC</label>
                    <input type="number" {...register('minAgeFoc', { required: true })} />

                    <label>Maximum Age of a child FOC</label>
                    <input type="number" {...register('maxAgeFoc', { required: true })} />

                    <label>Minimum Age of a child Chargable</label>
                    <input type="number" {...register('minAgeChargable', { required: true })} />

                    <label>Maximum Age of a child Chargable</label>
                    <input type="number" {...register('maxAgeChargable', { required: true })} />

                    <label>Child Supplement</label>
                    <input type="number" {...register('childSup', { required: true })} />

                    <label>Breakfast Supplement</label>
                    <input type="number" {...register('breakSup', { required: true })} />

                    <label>Lunch Supplement</label>
                    <input type="number" {...register('lunSup', { required: true })} />

                    <label>Dinner Supplement</label>
                    <input type="number" {...register('dinSup', { required: true })} />

                    <label>Room Categories and Charges</label>
                    {roomCategories.map((roomCategory, index) => (
                        <div key={index}>
                            <input
                                name="category"
                                placeholder="Room Category"
                                value={roomCategory.category}
                                onChange={(event) => handleRoomCategoryChange(index, event)}
                                required
                            />
                            <input
                                name="charges"
                                type="number"
                                placeholder="Charges"
                                value={roomCategory.charges}
                                onChange={(event) => handleRoomCategoryChange(index, event)}
                                required
                            />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button type="button" onClick={addRoomCategory} style={{ marginRight: '5px', color: 'white', backgroundColor: 'green', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
                                    <AiOutlinePlus /> Add Room Category
                                </button>
                                {roomCategories.length > 1 && (
                                    <button type="button" onClick={() => removeRoomCategory(index)} style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
                                        <FaTrash /> Remove Room Category
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <label>Add Images</label>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />

                    <button type="submit">Add Property</button>
                </form>
            )}
        </div>
    );
};

export default AddProperty;
