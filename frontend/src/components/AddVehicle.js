import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddVehicle() {
    // State for form fields
    const [vehicleNo, setVehicleNo] = useState("");
    const [vehicleBrand, setVehicleBrand] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleManufactureYear, setVehicleManufactureYear] = useState("");
    const [numberOfSeats, setNumberOfSeats] = useState("");
    const [vehicleStatus, setVehicleStatus] = useState("Available");
    const [vehicleFuel, setVehicleFuel] = useState("Petrol");
    const [vehicleSunroof, setVehicleSunroof] = useState(false);
    const [vehicleBootCapacity, setVehicleBootCapacity] = useState("");
    const [vehicleRate, setVehicleRate] = useState("");
    const [isOffRoad, setIsOffRoad] = useState(false);
    const [vehicleImage, setVehicleImage] = useState(null);
    const [availableModels, setAvailableModels] = useState([]);

    // Mapping of brands to their respective models
    const brandModelMapping = {
        Toyota: ["Corolla 🚗", "Camry 🚙", "Land Cruiser 🛻"],
        Ford: ["Focus 🚘", "Mustang 🏎️", "Explorer 🚙"],
        Honda: ["Civic 🚗", "Accord 🚙", "CR-V 🚙"],
        BMW: ["3 Series 🚗", "5 Series 🚘", "X5 🚙"],
        "Mercedes-Benz": ["C-Class 🚗", "E-Class 🚘", "GLC 🚙"],
        Audi: ["A4 🚗", "Q7 🚙", "A6 🚘"],
        Nissan: ["Altima 🚗", "Rogue 🚙", "GTR 🏎️"],
        Tesla: ["Model S 🚗", "Model X 🚙", "Model 3 ⚡"],
        Jeep: ["Wrangler 🚙", "Cherokee 🚙", "Gladiator 🛻"]
    };

    // Function to handle brand selection and set available models
    const handleBrandChange = (e) => {
        const selectedBrand = e.target.value;
        setVehicleBrand(selectedBrand);
        setAvailableModels(brandModelMapping[selectedBrand] || []);
        setVehicleModel(""); // Reset model field when brand changes
    };

    // Form submission handler
    function sendData(e) {
        e.preventDefault();

        // Validation checks
        if (!vehicleNo) {
            Swal.fire("Validation Error", "Vehicle No is required!", "error");
            return;
        }
        if (!vehicleBrand) {
            Swal.fire("Validation Error", "Vehicle Brand is required!", "error");
            return;
        }
        if (!vehicleModel) {
            Swal.fire("Validation Error", "Vehicle Model is required!", "error");
            return;
        }
        if (!vehicleManufactureYear || vehicleManufactureYear < 1886 || vehicleManufactureYear > new Date().getFullYear()) {
            Swal.fire("Validation Error", "Please enter a valid Manufacture Year!", "error");
            return;
        }
        if (!numberOfSeats) {
            Swal.fire("Validation Error", "Number of Seats is required!", "error");
            return;
        }
        if (!vehicleRate || isNaN(vehicleRate) || parseFloat(vehicleRate) <= 0) {
            Swal.fire("Validation Error", "Rental Rate must be a positive number!", "error");
            return;
        }
        if (!vehicleBootCapacity) {
            Swal.fire("Validation Error", "Boot Capacity is required!", "error");
            return;
        }

        const formData = new FormData();
        formData.append("VehicleNo", vehicleNo);
        formData.append("VehicleBrand", vehicleBrand);
        formData.append("VehicleModel", vehicleModel);
        formData.append("VehicleManufactureYear", vehicleManufactureYear);
        formData.append("NumberOfSeats", numberOfSeats);
        formData.append("VehicleStatus", vehicleStatus);
        formData.append("VehicleFuel", vehicleFuel);
        formData.append("VehicleSunroof", vehicleSunroof);
        formData.append("VehicleBootCapacity", vehicleBootCapacity);
        formData.append("VehicleRate", vehicleRate);
        formData.append("VehicleOFFRoad", isOffRoad);
        if (vehicleImage) formData.append("VehicleImage", vehicleImage);

        axios.post("http://localhost:8070/Vehicle/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "🚗 Vehicle Added!",
                text: "Your vehicle has been successfully added to the system. 🎉",
                showConfirmButton: false,
                timer: 2000
            });

            // Clear form after successful submission
            resetForm();
        })
        .catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Oops... 😢",
                text: "Something went wrong! " + err,
            });
        });
    }

    // Reset form function
    const resetForm = () => {
        setVehicleNo("");
        setVehicleBrand("");
        setVehicleModel("");
        setVehicleManufactureYear("");
        setNumberOfSeats("");
        setVehicleStatus("Available");
        setVehicleFuel("Petrol");
        setVehicleSunroof(false);
        setVehicleBootCapacity("");
        setVehicleRate("");
        setIsOffRoad(false);
        setVehicleImage(null);
        setAvailableModels([]);
    };

    return (
        <div className="container mt-5">
            <form onSubmit={sendData}>
                <div className="form-group">
                    <label htmlFor="vehicleNo">Vehicle No 🔢</label>
                    <input
                        type="text"
                        className="form-control"
                        id="vehicleNo"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleBrand">Vehicle Brand 🚘</label>
                    <select
                        id="vehicleBrand"
                        className="form-control"
                        value={vehicleBrand}
                        onChange={handleBrandChange}
                    >
                        <option value="">Choose Brand... 🚗</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Ford">Ford</option>
                        <option value="Honda">Honda</option>
                        <option value="BMW">BMW</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="Audi">Audi</option>
                        <option value="Nissan">Nissan</option>
                        <option value="Tesla">Tesla</option>
                        <option value="Jeep">Jeep</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleModel">Vehicle Model 🚗</label>
                    <select
                        id="vehicleModel"
                        className="form-control"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        disabled={!vehicleBrand}
                    >
                        <option value="">Choose Model... 🚙</option>
                        {availableModels.map((model, index) => (
                            <option key={index} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleManufactureYear">Manufacture Year 📅</label>
                    <input
                        type="number"
                        className="form-control"
                        id="vehicleManufactureYear"
                        value={vehicleManufactureYear}
                        onChange={(e) => setVehicleManufactureYear(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="seatingCapacity">Number of Seats 💺</label>
                    <select
                        id="seatingCapacity"
                        className="form-control"
                        value={numberOfSeats}
                        onChange={(e) => setNumberOfSeats(e.target.value)}
                    >
                        <option value="">Choose Seating... 🚗</option>
                        <option value="2">2 Seater</option>
                        <option value="3">3 Seater</option>
                        <option value="4">4 Seater</option>
                        <option value="5">5 Seater</option>
                        <option value="6">6 Seater</option>
                        <option value="7">7 Seater</option>
                        <option value="30+">30+ Seater 🚌</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleStatus">Vehicle Status 🔄</label>
                    <select
                        className="form-control"
                        id="vehicleStatus"
                        value={vehicleStatus}
                        onChange={(e) => setVehicleStatus(e.target.value)}
                    >
                        <option value="Available">Available ✅</option>
                        <option value="Rented">Rented 🚗</option>
                        <option value="Maintenance">Maintenance 🛠️</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleFuel">Fuel Type ⛽</label>
                    <select
                        className="form-control"
                        id="vehicleFuel"
                        value={vehicleFuel}
                        onChange={(e) => setVehicleFuel(e.target.value)}
                    >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric ⚡</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleSunroof">Sunroof 🛻</label>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="vehicleSunroof"
                        checked={vehicleSunroof}
                        onChange={(e) => setVehicleSunroof(e.target.checked)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleBootCapacity">Boot Capacity (L) 📦</label>
                    <input
                        type="number"
                        className="form-control"
                        id="vehicleBootCapacity"
                        value={vehicleBootCapacity}
                        onChange={(e) => setVehicleBootCapacity(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleRate">Rental Rate ($) 💲</label>
                    <input
                        type="number"
                        className="form-control"
                        id="vehicleRate"
                        value={vehicleRate}
                        onChange={(e) => setVehicleRate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isOffRoad">Off-road Capability 🚙</label>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isOffRoad"
                        checked={isOffRoad}
                        onChange={(e) => setIsOffRoad(e.target.checked)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="vehicleImage">Vehicle Image 📸</label>
                    <input
                        type="file"
                        className="form-control"
                        id="vehicleImage"
                        accept="image/*"
                        onChange={(e) => setVehicleImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-3">Add Vehicle 🚀</button>
            </form>
        </div>
    );
}
