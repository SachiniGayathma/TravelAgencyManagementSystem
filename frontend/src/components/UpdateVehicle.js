import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateVehicle() {
    const { vehicleNo } = useParams();
    const [NumberOfSeats, setNumberOfSeats] = useState("");
    const [VehicleStatus, setVehicleStatus] = useState("");
    const [VehicleBootCapacity, setVehicleBootCapacity] = useState("");
    const [VehicleRate, setVehicleRate] = useState("");

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await axios.get(`http://localhost:8070/Vehicle/findByVehicleNo/${vehicleNo}`);
                const data = res.data;
                setNumberOfSeats(data.NumberOfSeats || "");
                setVehicleStatus(data.VehicleStatus || "");
                setVehicleBootCapacity(data.VehicleBootCapacity || "");
                setVehicleRate(data.VehicleRate || "");
            } catch (err) {
                /*console.error("Error fetching vehicle:", err.message);
                toast.error("Failed to fetch vehicle data.");*/
            }
        };

        fetchVehicle();
    }, [vehicleNo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedVehicle = {};
        if (NumberOfSeats) updatedVehicle.NumberOfSeats = NumberOfSeats;
        if (VehicleStatus) updatedVehicle.VehicleStatus = VehicleStatus;
        if (VehicleBootCapacity) updatedVehicle.VehicleBootCapacity = VehicleBootCapacity;
        if (VehicleRate) updatedVehicle.VehicleRate = VehicleRate;

        try {
            await axios.put(`http://localhost:8070/Vehicle/updateByVehicleNo/${vehicleNo}`, updatedVehicle);
            toast.success("Update successfully!");
        } catch (err) {
            console.error("Error updating vehicle:", err.message);
            toast.error("Failed to update vehicle.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">🚗 Update Vehicle - {vehicleNo}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="seatingCapacity">🪑 Number of Seats</label>
                        <select 
                            id="seatingCapacity" 
                            className="form-control"
                            value={NumberOfSeats}
                            onChange={(e) => setNumberOfSeats(e.target.value)}
                        >
                            <option value="">Choose Seating...</option>
                            <option value="2">2 Seater</option>
                            <option value="3">3 Seater</option>
                            <option value="4">4 Seater</option>
                            <option value="5">5 Seater</option>
                            <option value="6">6 Seater</option>
                            <option value="7">7 Seater</option>
                            <option value="30+">30+ Seater</option>
                        </select>
                    </div>

                    <div className="form-group col-md-4">
                        <label htmlFor="vehicleStatus">🔧 Vehicle Status</label>
                        <select 
                            id="vehicleStatus" 
                            className="form-control"
                            value={VehicleStatus}
                            onChange={(e) => setVehicleStatus(e.target.value)}
                        >
                            <option value="">Choose Status...</option>
                            <option value="Available">Available</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>

                    <div className="form-group col-md-4">
                        <label htmlFor="bootCapacity">🎒 Boot Capacity (L)</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            id="bootCapacity" 
                            placeholder="Enter Capacity (10L)" 
                            min="5" 
                            max="15"
                            value={VehicleBootCapacity}
                            onChange={(e) => setVehicleBootCapacity(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="vehicleRate">💲 Daily Rental Rate (USD)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="vehicleRate" 
                            placeholder="Enter Rate"
                            value={VehicleRate}
                            onChange={(e) => setVehicleRate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Update Vehicle</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
