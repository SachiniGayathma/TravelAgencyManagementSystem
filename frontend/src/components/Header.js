import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const goToBookingList = () => {
        navigate('/bookings'); // Navigate to the bookings list
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
            <div className="container-fluid">
                <a className="navbar-brand" href="#" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FFD700" }}>
                    <i className="fas fa-car"></i> Vehicle Management
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link" style={{ fontSize: "1.2rem", color: "#FFD700" }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add" className="nav-link" style={{ fontSize: "1.2rem", color: "#FFD700" }}>Add Vehicle</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/book-vehicle" className="nav-link" style={{ fontSize: "1.2rem", color: "#FFD700" }}>Book Vehicle</Link>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-warning" onClick={goToBookingList} style={{ fontSize: "1.2rem", color: "#FFD700" }}>
                                View Bookings
                            </button>
                        </li>
                    </ul>
                </div>
                <span className="navbar-text time-display" style={{ color: "#FFD700" }}>
                    {currentTime}
                </span>
            </div>
        </nav>
    );
}

export default Header;
