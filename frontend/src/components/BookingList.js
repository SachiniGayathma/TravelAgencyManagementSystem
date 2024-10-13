import React, { useState, useEffect } from "react";
import axios from "axios";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'bootstrap/dist/css/bootstrap.min.css';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [fuelCost, setFuelCost] = useState(0);
    const [maintenanceCost, setMaintenanceCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState({
        vehicleNo: '',
        customerName: '',
        bookingDate: '',
        returnDate: ''
    });
    const [emailDetails, setEmailDetails] = useState({
        recipientEmail: '',
        subject: ''
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        axios.get('http://localhost:8070/Booking')
            .then((res) => {
                setBookings(res.data);
                const fuel = res.data.reduce((acc, booking) => acc + (booking.FuelCost || 0), 0);
                const maintenance = res.data.reduce((acc, booking) => acc + (booking.MaintenanceCost || 0), 0);
                setFuelCost(fuel);
                setMaintenanceCost(maintenance);
                setTotalCost(fuel + maintenance);
            })
            .catch((err) => {
                console.error("Error fetching bookings:", err.message);
            });
    };

    const deleteBooking = (id) => {
        axios.delete(`http://localhost:8070/Booking/delete/${id}`)
            .then(() => {
                fetchBookings();
            })
            .catch((err) => {
                console.error("Error deleting booking:", err.message);
            });
    };

    const updateBooking = (id) => {
        const bookingToEdit = bookings.find(booking => booking._id === id);
        setSelectedBooking(bookingToEdit);
        const updateModal = new window.bootstrap.Modal(document.getElementById('updateBookingModal'));
        updateModal.show();
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8070/Booking/update/${selectedBooking._id}`, selectedBooking)
            .then(() => {
                fetchBookings();
                const updateModal = window.bootstrap.Modal.getInstance(document.getElementById('updateBookingModal'));
                updateModal.hide();
                setSelectedBooking(null);
            })
            .catch((err) => {
                console.error("Error updating booking:", err.message);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedBooking({
            ...selectedBooking,
            [name]: value
        });
    };

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setEmailDetails({
            ...emailDetails,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm({
            ...searchTerm,
            [name]: value
        });
    };

    const filteredBookings = bookings.filter(booking => {
        return (
            (searchTerm.vehicleNo === '' || booking.VehicleNo.toLowerCase().includes(searchTerm.vehicleNo.toLowerCase())) &&
            (searchTerm.customerName === '' || booking.CustomerName.toLowerCase().includes(searchTerm.customerName.toLowerCase())) &&
            (searchTerm.bookingDate === '' || new Date(booking.BookingDate).toLocaleDateString() === new Date(searchTerm.bookingDate).toLocaleDateString()) &&
            (searchTerm.returnDate === '' || new Date(booking.ReturnDate).toLocaleDateString() === new Date(searchTerm.returnDate).toLocaleDateString())
        );
    });

    const downloadPDF = () => {
        const docDefinition = {
            content: [
                { text: 'Vehicle Booking Details', style: 'header' },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: [
                            [{ text: 'Vehicle No', style: 'tableHeader' },
                             { text: 'Customer Name', style: 'tableHeader' },
                             { text: 'Contact', style: 'tableHeader' },
                             { text: 'Booking Date', style: 'tableHeader' },
                             { text: 'Return Date', style: 'tableHeader' },
                             { text: 'Last Updated', style: 'tableHeader' }],
                            ...filteredBookings.map(booking => [
                                { text: booking.VehicleNo, style: 'tableData' },
                                { text: booking.CustomerName, style: 'tableData' },
                                { text: booking.CustomerContact, style: 'tableData' },
                                { text: new Date(booking.BookingDate).toLocaleDateString(), style: 'tableData' },
                                { text: new Date(booking.ReturnDate).toLocaleDateString(), style: 'tableData' },
                                { text: new Date(booking.lastUpdated).toLocaleDateString(), style: 'tableData' }
                            ])
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1 : 0;
                        },
                        vLineWidth: function (i) {
                            return 0;
                        },
                        hLineColor: function (i) {
                            return (i === 0) ? 'black' : '#aaa';
                        },
                        paddingLeft: function(i) { return 8; },
                        paddingRight: function(i) { return 8; },
                        paddingTop: function(i) { return 8; },
                        paddingBottom: function(i) { return 8; },
                    }
                },
                { text: `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin: [0, 5] }
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    margin: [0, 0, 0, 20],
                    alignment: 'center'
                },
                tableHeader: {
                    fillColor: '#4caf50',
                    color: 'white',
                    fontSize: 12,
                    bold: true,
                    margin: [0, 5, 0, 5],
                    alignment: 'center'
                },
                tableData: {
                    fontSize: 12,
                    margin: [0, 5, 0, 5],
                    alignment: 'left'
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                }
            }
        };

        pdfMake.createPdf(docDefinition).getBlob((blob) => {
            const formData = new FormData();
            formData.append('file', blob, 'bookings.pdf');
            formData.append('recipientEmail', emailDetails.recipientEmail); // Add recipient email
            formData.append('subject', emailDetails.subject); // Add subject

            axios.post('http://localhost:8070/send-email', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                alert('Email sent successfully!');
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Booking List</h1>

            {/* Email Input Section */}
            <div className="mb-4">
                <h3 className="text-center mb-4">Send Email</h3>
                <div className="form-group">
                    <label htmlFor="recipientEmail">Recipient Email</label>
                    <input
                        id="recipientEmail"
                        type="email"
                        name="recipientEmail"
                        className="form-control"
                        placeholder="Enter recipient email"
                        value={emailDetails.recipientEmail}
                        onChange={handleEmailChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        id="subject"
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Enter email subject"
                        value={emailDetails.subject}
                        onChange={handleEmailChange}
                    />
                </div>
            </div>

            <button className="btn btn-primary mb-4" onClick={downloadPDF}>Download as PDF</button>

            <div className="search-form mb-4">
                <h3 className="text-center mb-4">Search Bookings</h3>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="vehicleNo">Vehicle No</label>
                            <input
                                id="vehicleNo"
                                type="text"
                                name="vehicleNo"
                                className="form-control"
                                placeholder="Enter Vehicle No"
                                value={searchTerm.vehicleNo}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name</label>
                            <input
                                id="customerName"
                                type="text"
                                name="customerName"
                                className="form-control"
                                placeholder="Enter Customer Name"
                                value={searchTerm.customerName}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="bookingDate">Booking Date</label>
                            <input
                                id="bookingDate"
                                type="date"
                                name="bookingDate"
                                className="form-control"
                                value={searchTerm.bookingDate}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="returnDate">Return Date</label>
                            <input
                                id="returnDate"
                                type="date"
                                name="returnDate"
                                className="form-control"
                                value={searchTerm.returnDate}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Vehicle No</th>
                        <th>Customer Name</th>
                        <th>Contact</th>
                        <th>Booking Date</th>
                        <th>Return Date</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking.VehicleNo}</td>
                            <td>{booking.CustomerName}</td>
                            <td>{booking.CustomerContact}</td>
                            <td>{new Date(booking.BookingDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.ReturnDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.lastUpdated).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-warning" onClick={() => updateBooking(booking._id)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => deleteBooking(booking._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            

            {/* Update Booking Modal */}
            <div className="modal fade" id="updateBookingModal" tabIndex="-1" role="dialog" aria-labelledby="updateBookingModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateBookingModalLabel">Update Booking</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setSelectedBooking(null)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedBooking && (
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="vehicleNo">Vehicle No</label>
                                        <input
                                            id="vehicleNo"
                                            type="text"
                                            name="VehicleNo"
                                            className="form-control"
                                            value={selectedBooking.VehicleNo}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="customerName">Customer Name</label>
                                        <input
                                            id="customerName"
                                            type="text"
                                            name="CustomerName"
                                            className="form-control"
                                            value={selectedBooking.CustomerName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="customerContact">Contact</label>
                                        <input
                                            id="customerContact"
                                            type="text"
                                            name="CustomerContact"
                                            className="form-control"
                                            value={selectedBooking.CustomerContact}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bookingDate">Booking Date</label>
                                        <input
                                            id="bookingDate"
                                            type="date"
                                            name="BookingDate"
                                            className="form-control"
                                            value={new Date(selectedBooking.BookingDate).toISOString().split('T')[0]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="returnDate">Return Date</label>
                                        <input
                                            id="returnDate"
                                            type="date"
                                            name="ReturnDate"
                                            className="form-control"
                                            value={new Date(selectedBooking.ReturnDate).toISOString().split('T')[0]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update Booking</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
