import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc} from "firebase/firestore";
import { firebaseConfig } from "./../firebaseConfig"; // Import your config file
import "./Admin.css";

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

  const [totalAmount, setTotalAmount] = useState(0);
  var totalPresentDays = 0;
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false); // To show loading while fetching data
  const [numberOfDays, setNumberOfDays] = useState(1);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate(); // Month is 0-indexed, so add 1
  };

  const calculateDaysDifference = (start, end) => {
    const startDate = new Date(start.year, start.month, start.day);
    const endDate = new Date(end.year, end.month, end.day);

    if (endDate >= startDate) {
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfDays(diffDays+1);
    } else {
      setNumberOfDays(0); // Reset if the end date is earlier than the start date
    }
  };


  // Handle Start Date Changes
  const handleStartDateChange = (e) => {
    const { name, value } = e.target;
    const updatedStartDate = { ...startDate, [name]: parseInt(value) };
    setStartDate(updatedStartDate);
    calculateDaysDifference(updatedStartDate, endDate); // Recalculate days
  };

  // Handle End Date Changes
  const handleEndDateChange = (e) => {
    const { name, value } = e.target;
    const updatedEndDate = { ...endDate, [name]: parseInt(value) };
    setEndDate(updatedEndDate);
    calculateDaysDifference(startDate, updatedEndDate); // Recalculate days
  };

  // Handle Total Amount Change
  const handleAmountChange = (e) => {
    
    setTotalAmount(e.target.value);
  };

  // Handle the Get Summary Button Click
  // const handleGetSummary = async () => {
    
  //   setLoading(true);
  //   const users = ["ajay", "amal", "aravind", "jazeel", "manu", "mithun", "sreekanth", "sourav"]; // List of users to summarize
  //   let tempSummaryData = {}; // Temporary object to hold summary data for each user
  //   let presentData = {};
  //   const StartMonthName = new Date(startDate.year, startDate.month).toLocaleString('default', { month: 'long' }).toLowerCase();
  //   const EndMonthName = new Date(endDate.year, endDate.month).toLocaleString('default', { month: 'long' }).toLowerCase();

  //   // const startMonthYear = startDate.month+"-"+startDate.year;
  //   const startMonthYear = StartMonthName+"-"+startDate.year;
  //   const startDay = startDate.day;
  //   const endMonthYear = EndMonthName+"-"+endDate.year;
  //   const endDay = endDate.day;
  //   try {
  //     // Iterate over each user to fetch their data
      
  //     for (let user of users) {
  //       var present = 0, p1 = 0, p2 = 0;
  //       var docRef = doc(db, user, startMonthYear);
  //       var docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         var data = docSnap.data();
  //         if(startMonthYear === endMonthYear) {
  //           p1 = Object.entries(data).filter(([key, value]) => parseInt(key) >= startDay  && parseInt(key) <= endDay && value === 'p').length;
  //         }
  //         else{
  //           p1 = Object.entries(data).filter(([key, value]) => parseInt(key) >= startDay  && value === 'p').length;
  //         }
  //         // p1 = Object.entries(data)
  //         //   .filter(([key, value]) => parseInt(key) >= startDay  && value === 'p').length;
  //       } 
  //       if(startMonthYear === endMonthYear) {
  //         p2 = 0;
  //       }
  //       else{
  //         docRef = doc(db, user, endMonthYear);
  //         docSnap = await getDoc(docRef);
  //         if (docSnap.exists()) {
  //           const data = docSnap.data();
  //           p2 = Object.entries(data)
  //             .filter(([key, value]) => parseInt(key) <= endDay  && value === 'p').length;
  //         } 
  //       }
        
  //       present = p2 + p1;
  //       // console.log(user+':'+present);
  //       presentData[user] = present;
        
  //     }

  //     // Update the summaryData state with the result
        
  //     // tempSummaryData[user] = {
  //     //   totalDays: present,
  //     //   totalAmount: totalAmount
  //     // };
  //     for (let user of users) {
  //       totalPresentDays += presentData[user];
  //     }

  //     const totalPayable = totalAmount;
  //     const meterRent = 12;
  //     const fuelCharge = 32.76;
  //     const monthlyFuelSurcharge = 36.40;
  //     const fixedCharge = 253.67;
  //     var fixed = meterRent + fuelCharge + monthlyFuelSurcharge + fixedCharge;
  //     const duty = 1.1;
  //     const energyCharge = (totalPayable - fixed)/duty;
      
      
  //     fixed = totalPayable - energyCharge;
  //     const perPersonFixed = fixed/8;
  //     const perDayEnergyCharge = energyCharge/totalPresentDays;
      
  //     console.log('energy charge: '+ energyCharge);
  //     console.log('fixed: '+fixed);
  //     console.log('perday energy charge: '+ perDayEnergyCharge);
  //     console.log('perPersonFixed' + perPersonFixed);

  //     const finalFixed = totalPayable - (perDayEnergyCharge * totalPresentDays);
  //     console.log('finalFixed: '+finalFixed);
  //     const finalPerPersonFixed = finalFixed/8;

  //   console.log(energyCharge);

  //     for (let user of users) {
  //       tempSummaryData[user] = {
  //         totalDays: presentData[user],
  //         totalAmount: parseFloat((presentData[user] * perDayEnergyCharge + finalPerPersonFixed).toFixed(2))

  //       };
  //     }
  //     // console.log(tempSummaryData);

  //     setSummaryData(tempSummaryData);
  //   } catch (error) {
  //     console.error('Error fetching documents:', error);
  //     alert('Error fetching data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGetSummary = async () => {
    setLoading(true);
  
    const users = ["ajay", "amal", "aravind", "jazeel", "manu", "mithun", "sreekanth", "sourav"]; // List of users to summarize
    let tempSummaryData = {}; // Temporary object to hold summary data for each user
    let presentData = {};
    totalPresentDays = 0; // Reset total present days
  
    const startDateObj = new Date(startDate.year, startDate.month, startDate.day);
    const endDateObj = new Date(endDate.year, endDate.month, endDate.day);
  
    try {
      for (let user of users) {
        let present = 0;
  
        // Loop through months from startDate to endDate
        let currentDate = new Date(startDateObj);
        while (currentDate <= endDateObj) {
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          const currentMonthName = currentDate.toLocaleString('default', { month: 'long' }).toLowerCase();
          const currentMonthYear = `${currentMonthName}-${currentYear}`;
  
          // Fetch data for the current user and month
          const docRef = doc(db, user, currentMonthYear);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
  
            // Determine start and end days for the current month
            const startDay = currentYear === startDate.year && currentMonth === startDate.month
              ? startDate.day
              : 1;
  
            const endDay = currentYear === endDate.year && currentMonth === endDate.month
              ? endDate.day
              : getDaysInMonth(currentYear, currentMonth);
  
            // Count the number of 'p' (present) days in the range
            const monthPresentDays = Object.entries(data)
              .filter(([key, value]) => {
                const day = parseInt(key);
                return day >= startDay && day <= endDay && value === 'p';
              }).length;
  
            present += monthPresentDays;
          }
  
          // Move to the next month
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1); // Reset to the first day of the month
        }
  
        presentData[user] = present; // Store present days for the user
      }
  
      // Calculate summary data
      for (let user of users) {
        totalPresentDays += presentData[user];
      }
  
      const totalPayable = totalAmount;
      const meterRent = 12;
      const fuelCharge = 32.76;
      const monthlyFuelSurcharge = 36.40;
      const fixedCharge = 253.67;
      const fixed = meterRent + fuelCharge + monthlyFuelSurcharge + fixedCharge;
      const duty = 1.1;
      const energyCharge = (totalPayable - fixed) / duty;
  
      const finalFixed = totalPayable - energyCharge;
      const perPersonFixed = finalFixed / 8;
      const perDayEnergyCharge = energyCharge / totalPresentDays;
  
      // Update summary data for each user
      for (let user of users) {
        tempSummaryData[user] = {
          totalDays: presentData[user],
          totalAmount: parseFloat((presentData[user] * perDayEnergyCharge + perPersonFixed).toFixed(2)),
        };
      }
  
      setSummaryData(tempSummaryData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  

  // // Create months and years for dropdowns
  // const months = [
  //   'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  // ];

  // const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i);

  return (
    <div className="admin-container">
      <h1 className="admin-header">Select Duration</h1>
      <div className="date-container">

        {/* Date input  */}
        <div className="date-selection-container">
          {/* Start Date Selection */}
          <div className="date-selection">
            <label className="date-label" htmlFor="start-date">Select Start Date:</label>
            <div className="date-inputs">
            <select
              className="dropdown year-dropdown"
              name="year"
              value={startDate.year}
              onChange={handleStartDateChange}
            >
              {Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
              <select
                className="dropdown month-dropdown"
                name="month"
                value={startDate.month}
                onChange={handleStartDateChange}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                ))}
              </select>
              <select
                className="dropdown day-dropdown"
                name="day"
                value={startDate.day}
                onChange={handleStartDateChange}
              >
                {Array.from(
                  { length: getDaysInMonth(startDate.year, startDate.month) },
                  (_, i) => i + 1
                ).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))} 
              </select>
            </div>
          </div>

          {/* End Date Selection */}
          <div className="date-selection">
            <label className="date-label" htmlFor="end-date">Select End Date:</label>
            <div className="date-inputs">
              <select
                className="dropdown year-dropdown"
                name="year"
                value={endDate.year}
                onChange={handleEndDateChange}
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                className="dropdown month-dropdown"
                name="month"
                value={endDate.month}
                onChange={handleEndDateChange}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                ))}
              </select>
              <select
                className="dropdown day-dropdown"
                name="day"
                value={endDate.day}
                onChange={handleEndDateChange}
              >
                {Array.from(
                  { length: getDaysInMonth(endDate.year, endDate.month) },
                  (_, i) => i + 1
                ).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))} 
              </select>
            </div>
          </div>
        </div>
        
        <div className="info">
          {/* Total Amount Input */}
          <div className="amount-input">
            <label className="amount-label" htmlFor="amount">Enter Amount Payable: </label>
            <input
              className="text-input"
              type="number"
              id="amount"
              value={totalAmount}
              onChange={handleAmountChange}
            />
          </div>

          {/* Number of Days Display */}
          <div className="days-display">
            <label className="days-label">Number of Days:</label>
            <input
              className="text-input"
              type="text"
              value={numberOfDays}
              readOnly
            />
          </div>

          
          
          
        </div>
        
      </div>
  
      {/* Get Summary Button */}
      <div className="button-container">
        <button
          className={`get-summary-button ${loading ? 'loading' : ''}`}
          onClick={handleGetSummary}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Summary'}
        </button>
      </div>
  
      {/* Summary Display for All Users */}
      {summaryData && (
        <div className="summary-container">
          {Object.keys(summaryData).map((user) => (
            <div key={user} className="summary-user">
              <h3 className="summary-header">{user}</h3>
              <div className="summary-row">
                <label className="summary-label">Present:</label>
                <input
                  className="summary-input"
                  type="text"
                  value={`${summaryData[user].totalDays}/${numberOfDays} days`}
                  readOnly
                />
              </div>
              <div className="summary-row">
                <label className="summary-label">Amount: </label>
                <input
                  className="summary-input"
                  type="text"
                  value={`${summaryData[user].totalAmount} rs`}
                  readOnly
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Admin;