import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useLocation } from "react-router-dom";

export default function BookVehicle() {
    const location = useLocation();
    const [VehicleNo, setVehicleNo] = useState("");
    const [CustomerName, setCustomerName] = useState("");
    const [CustomerContact, setCustomerContact] = useState("");
    const [BookingDate, setBookingDate] = useState("");
    const [ReturnDate, setReturnDate] = useState("");

    useEffect(() => {
        if (location.state && location.state.VehicleNo) {
            setVehicleNo(location.state.VehicleNo);
        }
    }, [location.state]);

    const validateForm = () => {
        const phoneRegex = /^[0-9]{10}$/; // Adjust based on the expected format
        const today = new Date();
        const bookingDate = new Date(BookingDate);
        const returnDate = new Date(ReturnDate);

        if (!phoneRegex.test(CustomerContact)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Contact Number',
                text: 'Please enter a valid 10-digit contact number.',
            });
            return false;
        }

        if (bookingDate < today) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Booking Date',
                text: 'Booking date cannot be in the past.',
            });
            return false;
        }

        if (returnDate <= bookingDate) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Return Date',
                text: 'Return date must be after the booking date.',
            });
            return false;
        }

        return true;
    };

    const sendData = (e) => {
        e.preventDefault();

        // Validate the form before sending the data
        if (!validateForm()) {
            return; // Stop if validation fails
        }

        const newBooking = {
            VehicleNo,
            CustomerName,
            CustomerContact,
            BookingDate,
            ReturnDate
        };

        axios.post("http://localhost:8070/Booking/add", newBooking)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Confirmed!',
                    text: 'Your vehicle has been booked successfully.',
                    showConfirmButton: false,
                    timer: 2000
                });
                // Clear form
                setVehicleNo("");
                setCustomerName("");
                setCustomerContact("");
                setBookingDate("");
                setReturnDate("");
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Something went wrong! ${err.response ? err.response.data : err.message}`,
                });
            });
    };

    return (
        <div className="container mt-5">
            <form onSubmit={sendData}>
                <h1 className="mb-4 text-center">Book a Vehicle</h1>

                <div className="form-group">
                    <label htmlFor="vehicleNo">🚗 Vehicle Number</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="vehicleNo" 
                        placeholder="Enter Vehicle Number" 
                        value={VehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        required
                        readOnly={location.state && location.state.VehicleNo} // Make read-only if passed from the state
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerName">👤 Customer Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="customerName" 
                        placeholder="Enter Your Name" 
                        value={CustomerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerContact">📞 Contact Number</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="customerContact" 
                        placeholder="Enter Contact Number" 
                        value={CustomerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bookingDate">📅 Booking Date</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        id="bookingDate" 
                        value={BookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="returnDate">📅 Return Date</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        id="returnDate" 
                        value={ReturnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}
