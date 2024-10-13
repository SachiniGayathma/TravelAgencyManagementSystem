import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AllVehicle() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [brandFilter, setBrandFilter] = useState("");
    const [modelFilter, setModelFilter] = useState("");
    const [seatsFilter, setSeatsFilter] = useState("");
    const [fuelFilter, setFuelFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modelOptions, setModelOptions] = useState([]);
    const navigate = useNavigate();

    // Predefined list of vehicle models based on brands
    const brandModelMap = {
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

    const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
    const seatOptions = ["2", "3", "4", "5", "6","7","30+"];

    useEffect(() => {
        setIsLoading(true);
        async function getVehicles() {
            try {
                const res = await axios.get("http://localhost:8070/Vehicle/");
                setVehicles(res.data);
                setFilteredVehicles(res.data);
            } catch (err) {
                console.error("Error fetching vehicles:", err.message);
            } finally {
                setIsLoading(false);
            }
        }
        getVehicles();
    }, []);

    useEffect(() => {
        // Update models based on selected brand
        if (brandFilter && brandModelMap[brandFilter]) {
            setModelOptions(brandModelMap[brandFilter]);
        } else {
            setModelOptions([]);
        }
    }, [brandFilter]);

    useEffect(() => {
        const filtered = vehicles.filter(vehicle => {
            return (
                (brandFilter === "" || vehicle.VehicleBrand.includes(brandFilter)) &&
                (modelFilter === "" || vehicle.VehicleModel.includes(modelFilter)) &&
                (seatsFilter === "" || vehicle.NumberOfSeats.toString() === seatsFilter) &&
                (fuelFilter === "" || vehicle.VehicleFuel.includes(fuelFilter))
            );
        });
        setFilteredVehicles(filtered);
    }, [brandFilter, modelFilter, seatsFilter, fuelFilter, vehicles]);

    const handleDelete = async (vehicle) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const originalVehicles = [...vehicles];
            setVehicles(prevVehicles => prevVehicles.filter(v => v.VehicleNo !== vehicle.VehicleNo));
            setFilteredVehicles(prevFiltered => prevFiltered.filter(v => v.VehicleNo !== vehicle.VehicleNo));

            try {
                await axios.delete(`http://localhost:8070/Vehicle/deleteByVehicleNo/${vehicle.VehicleNo}`);
                Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
            } catch (err) {
                console.error("Error deleting vehicle:", err.message);
                setVehicles(originalVehicles);
                setFilteredVehicles(originalVehicles);
                Swal.fire('Error!', 'There was an error deleting the vehicle. Please try again.', 'error');
            }
        }
    };

    const handleBook = (vehicleNo) => {
        navigate(`/book-vehicle`, { state: { VehicleNo: vehicleNo } });
    };

    // Function to get the border color based on the vehicle status
    const getBorderColor = (status) => {
        switch (status) {
            case "Available":
                return "green";
            case "Maintenance":
                return "red";
            case "Rented":
                return "grey";
            default:
                return "black";
        }
    };

    return (
        <div>
            <h1 className="text-center">All Vehicles</h1>
            <div className="container mb-4">
                <h3 className="text-center">Filter Vehicles</h3>
                <form className="form-row mb-3">
                    <div className="form-group col-md-3">
                        <select 
                            className="form-control"
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                        >
                            <option value="">Select Brand</option>
                            {Object.keys(brandModelMap).map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <select 
                            className="form-control"
                            value={modelFilter}
                            onChange={(e) => setModelFilter(e.target.value)}
                            disabled={!brandFilter} // Disable if no brand is selected
                        >
                            <option value="">Select Model</option>
                            {modelOptions.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <select 
                            className="form-control" 
                            value={seatsFilter}
                            onChange={(e) => setSeatsFilter(e.target.value)}
                        >
                            <option value="">Select Seats</option>
                            {seatOptions.map((seats) => (
                                <option key={seats} value={seats}>
                                    {seats} Seats
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <select 
                            className="form-control"
                            value={fuelFilter}
                            onChange={(e) => setFuelFilter(e.target.value)}
                        >
                            <option value="">Select Fuel Type</option>
                            {fuelTypes.map((fuel) => (
                                <option key={fuel} value={fuel}>
                                    {fuel}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>

            {isLoading ? (
                <p className="text-center">Loading vehicles...</p>
            ) : (
                <div className="row">
                    {filteredVehicles.map((vehicle) => (
                        <div className="col-md-4 mb-4" key={vehicle._id}>
                            <div 
                                className="card" 
                                style={{ 
                                    border: `5px solid ${getBorderColor(vehicle.VehicleStatus)}`,
                                    borderRadius: '10px' 
                                }}
                            >
                                <img 
                                    src={`http://localhost:8070/${vehicle.VehicleImage}`} 
                                    alt={`${vehicle.VehicleBrand} ${vehicle.VehicleModel}`} 
                                    className="card-img-top" 
                                    style={{ height: '200px', objectFit: 'cover' }} 
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'path/to/default-image.jpg'; }} 
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{vehicle.VehicleBrand} {vehicle.VehicleModel}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{vehicle.VehicleNo}</h6>
                                    <p className="card-text">
                                        <strong>Year:</strong> {vehicle.VehicleManufactureYear} <br />
                                        <strong>Seats:</strong> {vehicle.NumberOfSeats} <br />
                                        <strong>Status:</strong> {vehicle.VehicleStatus} <br />
                                        <strong>Fuel:</strong> {vehicle.VehicleFuel} <br />
                                        <strong>Sunroof:</strong> {vehicle.VehicleSunroof ? "Yes" : "No"} <br />
                                        <strong>Boot Capacity:</strong> {vehicle.VehicleBootCapacity} <br />
                                        <strong>Rate:</strong> {vehicle.VehicleRate} <br />
                                        <strong>Off Road:</strong> {vehicle.VehicleOFFRoad ? "Yes" : "No"}
                                    </p>
                                    <Link to={`/update-vehicle/${vehicle.VehicleNo}`}>
                                        <button className="btn btn-primary">✏️ Update</button>
                                    </Link>
                                    <button className="btn btn-danger ml-2" onClick={() => handleDelete(vehicle)}>
                                        🗑️ Delete
                                    </button>
                                    <button className="btn btn-success ml-2" onClick={() => handleBook(vehicle.VehicleNo)}>
                                        📅 Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
