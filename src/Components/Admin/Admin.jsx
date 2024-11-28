import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc} from "firebase/firestore";
import { firebaseConfig } from "./../firebaseConfig"; // Import your config file


// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Admin = () => {
  const [startDate, setStartDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: 1
  });

  const [endDate, setEndDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: 1
  });

  const [totalAmount, setTotalAmount] = useState('');
  var totalPresentDays = 0;
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false); // To show loading while fetching data

  // Handle Start Date Changes
  const handleStartDateChange = (e) => {
    const { name, value } = e.target;
    setStartDate((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle End Date Changes
  const handleEndDateChange = (e) => {
    const { name, value } = e.target;
    setEndDate((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle Total Amount Change
  const handleAmountChange = (e) => {
    
    setTotalAmount(e.target.value);
  };

  // Handle the Get Summary Button Click
  const handleGetSummary = async () => {
    
    setLoading(true);
    const users = ["ajay", "amal", "aravind", "jazeel", "manu", "mithun", "sreekanth", "sourav"]; // List of users to summarize
    let tempSummaryData = {}; // Temporary object to hold summary data for each user
    let presentData = {};
    const StartMonthName = new Date(startDate.year, startDate.month).toLocaleString('default', { month: 'long' }).toLowerCase();
    const EndMonthName = new Date(endDate.year, endDate.month).toLocaleString('default', { month: 'long' }).toLowerCase();

    // const startMonthYear = startDate.month+"-"+startDate.year;
    const startMonthYear = StartMonthName+"-"+startDate.year;
    const startDay = startDate.day;
    const endMonthYear = EndMonthName+"-"+endDate.year;
    const endDay = endDate.day;
    try {
      // Iterate over each user to fetch their data
      
      for (let user of users) {
        var present = 0, p1 = 0, p2 = 0;
        var docRef = doc(db, user, startMonthYear);
        var docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          var data = docSnap.data();
          p1 = Object.entries(data)
            .filter(([key, value]) => parseInt(key) >= startDay  && value === 'p').length;
        } 

        docRef = doc(db, user, endMonthYear);
        docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          p2 = Object.entries(data)
            .filter(([key, value]) => parseInt(key) <= endDay  && value === 'p').length;
        } 
        
        present = p2 + p1;
        // console.log(user+':'+present);
        presentData[user] = present;
        
      }

      // Update the summaryData state with the result
        
      // tempSummaryData[user] = {
      //   totalDays: present,
      //   totalAmount: totalAmount
      // };
      for (let user of users) {
        totalPresentDays += presentData[user];
      }

      const totalPayable = totalAmount;
      const meterRent = 12;
      const fuelCharge = 32.76;
      const monthlyFuelSurcharge = 36.40;
      const fixedCharge = 240;
      const fixed = meterRent + fuelCharge + monthlyFuelSurcharge + fixedCharge;
      const duty = 1.1;
      const energyCharge = (totalPayable - fixed)/duty;
      console.log('perday energy charge: '+energyCharge/totalPresentDays);
      const perDayEnergyCharge = energyCharge/totalPresentDays;

    console.log(energyCharge);

      for (let user of users) {
        tempSummaryData[user] = {
          totalDays: presentData[user],
          totalAmount: parseFloat((presentData[user] * perDayEnergyCharge + (totalPayable - energyCharge) / 8).toFixed(2))

        };
      }
      // console.log(tempSummaryData);

      setSummaryData(tempSummaryData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Create months and years for dropdowns
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i);

  return (
    <div>
      <h1>Select Duration</h1>

      {/* Start Date Selection */}
      <div>
        <label htmlFor="start-date">Select Start Date: </label>
        <div>
          <select
            name="year"
            value={startDate.year}
            onChange={handleStartDateChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            name="month"
            value={startDate.month}
            onChange={handleStartDateChange}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            name="day"
            value={startDate.day}
            onChange={handleStartDateChange}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* End Date Selection */}
      <div>
        <label htmlFor="end-date">Select End Date: </label>
        <div>
          <select
            name="year"
            value={endDate.year}
            onChange={handleEndDateChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            name="month"
            value={endDate.month}
            onChange={handleEndDateChange}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            name="day"
            value={endDate.day}
            onChange={handleEndDateChange}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Amount Input */}
      <div>
        <label htmlFor="amount">Enter Total Amount Payable: </label>
        <input
          type="number"
          id="amount"
          value={totalAmount}
          onChange={handleAmountChange}
        />
      </div>

      {/* Get Summary Button */}
      <div>
        <button onClick={handleGetSummary} disabled={loading}>
          {loading ? 'Loading...' : 'Get Summary'}
        </button>
      </div>

      {/* Summary Display for All Users */}
      {summaryData && (
        <div style={{ marginTop: '20px' }}>
          {Object.keys(summaryData).map((user) => (
            <div key={user} style={{ marginBottom: '10px' }}>
              <h3>{user}</h3>
              <div>
                <label>Present:</label>
                <input type="text" value={summaryData[user].totalDays + ' days'} readOnly />
              </div>
              <div>
                <label>Amount: </label>
                <input type="text" value={summaryData[user].totalAmount + 'rs'} readOnly />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;