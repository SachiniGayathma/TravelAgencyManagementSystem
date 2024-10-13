import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt,FaHotel } from 'react-icons/fa';
import { MdBedroomParent } from "react-icons/md";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // This is optional, for table functionality

function PropertyDetail() {

  
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(false);
  const [numChildren, setNumChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [showTotalCost, setShowTotalCost] = useState(false);
  const [mealPlan, setMealPlan] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [currency, setCurrency] = useState("USD"); // Default currency
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate
  const { id } = useParams();
  const [dateError, setDateError] = useState(null); 


  useEffect(() => {
    async function getProperty() {
      try {
        const response = await axios.get(`http://localhost:8070/property/get/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Error fetching property details. Please try again later.");
      }
    }

    getProperty();
  }, [id]);

  useEffect(() => {
    async function fetchExchangeRate() {
      if (currency === "USD") {
        setExchangeRate(1); // Set exchange rate to 1 for USD
      } else {
        try {
          const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
          setExchangeRate(response.data.rates[currency]);
        } catch (err) {
          console.error("Error fetching exchange rate:", err);
          setExchangeRate(1); // Default to 1 if there's an error
        }
      }
    }
    fetchExchangeRate();
}, [currency]);


  
  


  const calculateTotalCost = () => {

    if (!validateDates()) {
      setTotalCost(0);
      return;
    }

    if (property && arrivalDate && departureDate) {
      let totalSupplement = 0;
      const arrival = new Date(arrivalDate);
      const departure = new Date(departureDate);

      if (isNaN(arrival.getTime()) || isNaN(departure.getTime()) || arrival >= departure) {
        console.error("Invalid arrival or departure date");
        setTotalCost(0);
        return;
      }

      // Calculate supplements based on the number of adults
      if (adults === 1) {
        totalSupplement = property.chargePerHead || 0;
      } else if (adults === 2) {
        totalSupplement = (property.chargePerHead || 0) + (property.adult2Sup || 0);
      } else if (adults === 3) {
        totalSupplement = (property.chargePerHead || 0) + (property.adult2Sup || 0) + (property.adult3Sup || 0);
      }

      // Find the selected room category charges
      const selectedRoomCharges = property.roomCategories.find(cat => cat.category === selectedRoom)?.charges || 0;
      totalSupplement += selectedRoomCharges;

      // Add meal supplements
      if (mealPlan.breakfast) totalSupplement += property.breakSup * adults || 0;
      if (mealPlan.lunch) totalSupplement += property.lunSup * adults || 0;
      if (mealPlan.dinner) totalSupplement += property.dinSup * adults || 0;

      // Calculate the number of nights
      const numNights = Math.max((departure - arrival) / (1000 * 60 * 60 * 24), 0);

      // Add seasonal supplements based on the dates
      const isWinter = (arrival >= new Date(`2023-11-01`) && departure <= new Date(`2024-04-30`)) ||
                        (arrival <= new Date(`2024-04-30`) && departure >= new Date(`2023-11-01`));
      const isSummer = (arrival >= new Date(`2024-05-01`) && departure <= new Date(`2024-10-31`)) ||
                        (arrival <= new Date(`2024-10-31`) && departure >= new Date(`2024-05-01`));
      if (isWinter) {
        totalSupplement += (property.winterCharge || 0);
      } else if (isSummer) {
        totalSupplement += (property.summerCharge || 0);
      }

      // Process children
      let validChildrenCount = 0;
      const maxAgeFoc = property.maxAgeFoc || 0;
      const minAgeChargable = property.minAgeChargable || 0;
      const maxAgeChargable = property.maxAgeChargable || 0;
      const childSup = property.childSup || 0;

      childrenAges.forEach((age) => {
        if (age <= maxAgeFoc) {
          validChildrenCount++;
          return;
        } else if (age >= minAgeChargable && age <= maxAgeChargable) {
          totalSupplement += childSup;
          validChildrenCount++;
        } else if (age > maxAgeChargable) {
          // If child age is greater than maxAgeChargable, consider as zero for cost purposes
          if (adults === 1) {
            totalSupplement += property.adult2Sup || 0;
            setAdults(2);
          } else if (adults === 2) {
            totalSupplement += property.adult3Sup || 0;
            setAdults(3);
          }
          if (mealPlan.breakfast) totalSupplement += property.breakSup || 0;
          if (mealPlan.lunch) totalSupplement += property.lunSup || 0;
          if (mealPlan.dinner) totalSupplement += property.dinSup || 0;
        }
      });

      const calculatedTotalCost = totalSupplement * numNights;
      setTotalCost(calculatedTotalCost * exchangeRate);
      setShowTotalCost(true);
      setNumChildren(validChildrenCount); // Update valid children count
    } else {
      setTotalCost(0);
      setShowTotalCost(false);
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const validateDates = () => {
    const today = new Date();
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
  
    if (arrival < today || departure < today) {
      setDateError("Please select valid dates. Arrival and departure dates cannot be in the past.");
      return false;
    }
    if (arrival >= departure) {
      setDateError("Please ensure the check-out date is after the check-in date.");
      return false;
    }
  
    setDateError(null); // No error if dates are valid
    return true;
  };

  
  const closeModal = () => {
    setShowTotalCost(false);
  };

  

  const downloadPDF = () => {
    const doc = new jsPDF();

  // Add company logo and name at the top
  const logo = new Image();
  logo.src = `${process.env.PUBLIC_URL}/logo22.png.png`; // Replace with the correct logo URL
  doc.addImage(logo, 'PNG', 1, 5, 50, 50); // Adjust size (width: 40, height: 20)

  // Add company name next to the logo
  doc.setFontSize(16);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(0, 0, 255); // RGB value for blue
  doc.text('Exciting Travel Holidays', 40, 30); // Adjust the position as necessary

  
 

  // Add property image (minimized size)
  const img = new Image();
  img.src = property.imageUrls[0]; // Property image
  doc.addImage(img, 'JPEG', 14, 40, 120, 60); // Minimized image size (width: 120, height: 60)

  // Add property details table (minimized size)
  const tableData = [
    ['Location', property.destination],
    ['Arrival Date', arrivalDate],
    ['Departure Date', departureDate],
    ['Number of Nights', numNights],
    ['Selected Room', selectedRoom],
    ['Adults', adults],
    ['Children', numChildren],
    ['Meal Plan', Object.entries(mealPlan).filter(([key, value]) => value).map(([key]) => key).join(', ')],
    ['Total Cost', `${currency} ${(totalCost).toFixed(2)}`],
  ];

  doc.autoTable({
    head: [['Property Name', property.name]],
    body: tableData,
    startY: 110, // Adjusted to fit below the image
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Header styling
    styles: { fontSize: 9, cellPadding: 3 }, // Minimized font size and padding
    margin: { top: 40 },
  });

  // Add footer message, slightly above the bottom of the page
  const footerText = `Hope you'll choose our exciting travel holidays as your booking partner at ${property.name}`;
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'italic');
  doc.text(footerText, 28, doc.internal.pageSize.height - 80); // Positioned 25 units from the bottom

  

  // Save the PDF
  doc.save('property-details.pdf');
  };

  const shareTotalCost = () => {
    const shareData = {
      title: 'Property Total Cost',
      text: `Total cost for your stay at ${property.name} is ${currency} ${totalCost.toFixed(2)}`,
      
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error("Error sharing:", err);
      });
    } else {
      alert('Share functionality is not supported on this browser.');
    }
  };

  const handleAdultChange = (e) => {
    setAdults(Number(e.target.value));
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleMealChange = (e) => {
    const { name, checked } = e.target;
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [name]: checked
    }));
  };

  const handleArrivalDateChange = (e) => {
    setArrivalDate(e.target.value);
  };

  const handleDepartureDateChange = (e) => {
    setDepartureDate(e.target.value);
  };

  const handleChildrenChange = (e) => {
    setChildren(e.target.value === 'yes');
    setChildrenAges([]);
  };

  const handleNumChildrenChange = (e) => {
    const num = Number(e.target.value);
    setNumChildren(num);
    setChildrenAges(Array(num).fill(''));
  };

  const handleChildAgeChange = (index, value) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = value;
    setChildrenAges(updatedAges);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!property) {
    return <p>Loading...</p>;
  }

  const numNights = arrivalDate && departureDate ? Math.max((new Date(departureDate) - new Date(arrivalDate)) / (1000 * 60 * 60 * 24), 0) : 0;

  

  return (
    <div className="property-detail">
      <h1>{property.name}</h1>
      <div className="property-info-box">
        <div className="property-images">
          <img src={property.imageUrls[0]} alt={property.name} />
        </div>
        <div className="property-info">
          
        <div className="info-row">
      <div className="location-type">
        <p><FaMapMarkerAlt /> <strong>Location:</strong> {property.destination}</p>
        <p><strong><FaHotel /> Property Type:</strong> {property.type}</p>
      </div>
    </div>
    <div className="info-row meal-charges">
      <p><strong>Breakfast Charges:</strong> ${property.breakSup || 0}</p>
      <p><strong>Lunch Charges :</strong> ${property.lunSup || 0}</p>
      <p><strong>Dinner Charges :</strong> ${property.dinSup || 0}</p>
    </div>
    <div className="room-categories">
        <h3>Room Categories</h3>
        <div className="room-categories-grid">
          {property.roomCategories.map((cat, index) => (
            <div className="room-category-card" key={index}>
              <h4><MdBedroomParent /> {cat.category}</h4>
              <p>Charges: ${cat.charges}</p>
            </div>
          ))}
        </div>
      </div>
        </div>
      </div>
      <div className="filter-box">
        <div className="cost-calculation">
          <div className="room-categories">
            <h3>Room Categories</h3>
            <select value={selectedRoom} onChange={handleRoomChange}>
              <option value="">Standard Room</option>
              {property.roomCategories.map((cat, index) => (
                <option key={index} value={cat.category}>{cat.category}</option>
              ))}
            </select>
          </div>
          
           <h3>Number of Adults</h3> 
            <input type="number" value={adults} onChange={handleAdultChange} min="1" max="3" />
          
          <h3>Select Meal Plan</h3>    
  <div className="checkbox-container">
  <label>Breakfast</label>
  <input type="checkbox" name="breakfast" checked={mealPlan.breakfast} onChange={handleMealChange} />
</div>
<div className="checkbox-container">
  <label>Lunch</label>
  <input type="checkbox" name="lunch" checked={mealPlan.lunch} onChange={handleMealChange} />
</div>
<div className="checkbox-container">
  <label>Dinner</label>
  <input type="checkbox" name="dinner" checked={mealPlan.dinner} onChange={handleMealChange} />
</div>

          <div>
          <h3>Select Date Of Check-In</h3>
              <input type="date" value={arrivalDate} onChange={handleArrivalDateChange} />
          
              <h3>Select Date Of Check-Out</h3>   
             
              <input type="date" value={departureDate} onChange={handleDepartureDateChange} />
          
          </div>
          <div>

          {dateError && <p className="error-message">{dateError}</p>}

              
              <h3>Have Children?</h3>
              <select value={children ? 'yes' : 'no'} onChange={handleChildrenChange}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
           
          </div>
          {children && (
            <div>
              <label>
                Number of Children:
                <input type="number" value={numChildren} onChange={handleNumChildrenChange} min="0" />
              </label>
              {Array.from({ length: numChildren }, (_, i) => (
                <div key={i}>
                  <label>
                    Age of Child {i + 1}:
                    <input type="number" value={childrenAges[i] || ''} onChange={(e) => handleChildAgeChange(i, e.target.value)} />
                  </label>
                </div>
              ))}
            </div>
          )}
          

           <h3>Select Currency</h3> 
            <select value={currency} onChange={handleCurrencyChange}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="LKR">LKR (Rs)</option>
            </select>
          

          <button onClick={calculateTotalCost}>Calculate Cost</button>
        </div>
      </div>
      {showTotalCost && (
  <div className="modal-overlay">
    <div className="modal-content">
      <img src={property.imageUrls[0]} alt={property.name} />
      <h3>{property.name}</h3>
      <p><strong>Location:</strong> {property.destination}</p>
      <p><strong>Arrival Date:</strong> {arrivalDate}</p>
      <p><strong>Departure Date:</strong> {departureDate}</p>
      <p><strong>Number of Nights:</strong> {numNights}</p>
      <p><strong>Selected Room:</strong> {selectedRoom}</p>
      <p><strong>Adults:</strong> {adults}</p>
      <p><strong>Children:</strong> {numChildren}</p>
      <p><strong>Meal Plan:</strong> {Object.entries(mealPlan).filter(([key, value]) => value).map(([key]) => key).join(', ')}</p>
      <p>
  <strong>Total Cost: 

    {currency === "USD" ? " $ " 
     : currency === "EUR" ? " € " 
     : currency === "GBP" ? " £ " 
     : currency === "LKR" ? " Rs " 
     : currency === "AUD" ? " A$ " 
     : currency === "SAR" ? " ﷼ "
     : " "}
  </strong> 

  {totalCost.toFixed(2)}
</p>

      <div className="modal-buttons">
        <button onClick={closeModal}>Close</button>
        <button onClick={downloadPDF}>Download PDF</button>
        <button onClick={shareTotalCost}>Share Details</button>

        
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default PropertyDetail;
