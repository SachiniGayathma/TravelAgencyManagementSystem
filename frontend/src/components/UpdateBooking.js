import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function UpdateBooking() {
    const { id } = useParams();
    const [VehicleNo, setVehicleNo] = useState("");
    const [CustomerName, setCustomerName] = useState("");
    const [CustomerContact, setCustomerContact] = useState("");
    const [BookingDate, setBookingDate] = useState("");
    const [ReturnDate, setReturnDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8070/Booking/${id}`)
            .then((res) => {
                const data = res.data;
                setVehicleNo(data.VehicleNo);
                setCustomerName(data.CustomerName);
                setCustomerContact(data.CustomerContact);
                setBookingDate(new Date(data.BookingDate).toISOString().split('T')[0]);
                setReturnDate(new Date(data.ReturnDate).toISOString().split('T')[0]);
            })
            .catch((err) => {
                console.error("Error fetching booking:", err.message);
            });
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();

        const updatedBooking = {
            VehicleNo,
            CustomerName,
            CustomerContact,
            BookingDate,
            ReturnDate
        };

        axios.put(`http://localhost:8070/Booking/update/${id}`, updatedBooking)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Updated!',
                    text: 'The booking has been successfully updated.',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/bookings'); // Redirect back to the bookings list
            })
            .catch((err) => {
                console.error("Error updating booking:", err.message);
            });
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Update Booking</h1>
            <form onSubmit={handleSubmit}>
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
                        readOnly // Make this read-only since vehicle number shouldn't change
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

                <button type="submit" className="btn btn-primary">Update Booking</button>
            </form>
        </div>
    );
}
