import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "./../firebaseConfig"; // Import your config file
import "./Calendar.css"; // Ensure your styles are correct

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Calendar = ({ monthYear, username }) => {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState({}); // Track changes on selected days
  const [password, setPassword] = useState(""); // State to store the password
  
  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, username, monthYear);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fields = docSnap.data();
          setData(fields);
        } else {
          // setError("No document found");
          console.log('error here');
        }
      } catch (err) {
        setError(err.message);
        
      }
    };

    if (monthYear && username) {
      fetchData();
    }
  }, [monthYear, username]);

  // Toggle day status between 'p' and 'a'
  const toggleDay = (day) => {
    setSelectedDays((prevSelectedDays) => {
      const currentValue = prevSelectedDays[day] || (data && data[day]) || "p"; // Default to 'p' if not set
      const newValue = currentValue === "p" ? "a" : "p"; // Toggle between 'p' and 'a'
      
      return {
        ...prevSelectedDays,
        [day]: newValue, // Update the selected day
      };
    });
  };

  // Function to generate and add the month document with day values
  const generateCalendarRecord = async () => {
    try {
      // Parse the year and month from the `monthYear` string
      const [monthName, year] = monthYear.split('-');
      const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth(); // Convert month name to index (0-based)
      const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate(); // Get number of days in the month
  
      const docRef = doc(db, username, monthYear); // Firestore document reference
  
      // Build the data object with day numbers as keys and "p" as values
      const updateData = {};
      for (let i = 1; i <= daysInMonth; i++) {
        updateData[i.toString()] = "p";
      }
  
      console.log("Document Data to Save:", updateData); // Debug log to confirm data structure
  
      // Use Firestore's `setDoc` to create or overwrite the document
      await setDoc(docRef, updateData);
  
      alert(`${monthYear} document created with all days set to 'p'`);
      setData(updateData); // Update local state to reflect new data
    } catch (err) {
      console.error("Error generating calendar:", err); // Log error to console for debugging
      setError("Error generating calendar: " + err.message); // Show error in UI
    }
  };
  

  // Update Firebase with the selected days
  const updateCalendar = async () => {
    try {
      if (!password) {
        alert("Please enter a password.");
        return;
      }
  
      // Fetch the user password from Firebase
      const passwordDocRef = doc(db, "password", "password"); // Access the document with ID 'password' in the 'password' collection
      const passwordDocSnap = await getDoc(passwordDocRef);
  
      if (passwordDocSnap.exists()) {
        const storedPassword = passwordDocSnap.data()[username]; // Retrieve the field corresponding to the username
  
        if (storedPassword === password) {
          // Proceed with updating the calendar
          const docRef = doc(db, username, monthYear);
          await updateDoc(docRef, selectedDays);
          alert("Calendar updated successfully!");
        } else {
          alert("Wrong password. Please try again.");
        }
      } else {
        alert("No password document found.");
      }
    } catch (err) {
      setError("Error updating the calendar: " + err.message);
    }
  };
  

  // Generate the calendar layout for the month (30 days)
  // Generate the calendar layout for the given month and year
const generateCalendar = () => {
  const [monthName, year] = monthYear.split('-'); // Split monthYear (e.g., "november-2024") into month and year
  const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth(); // Get month index (0 = Jan, 1 = Feb, ..., 11 = Dec)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // Get number of days in the month
  var startDayOfMonth = new Date(year, monthIndex, 1).getDay(); // Get the weekday of the 1st day of the month (0 = Sunday, 6 = Saturday)
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]; // Weekday headers
  const rows = []; // To store the rows for the calendar

  // Add week days header (S, M, T, W, T, F, S)
  rows.push(
    <div key="header" className="calendar-row">
      {weekDays.map((day, index) => (
        <div key={index} className="calendar-cell header">
          {day}
        </div>
      ))}
    </div>
  );

  // Add the days (1 to daysInMonth) to the calendar grid
  let dayCounter = 1;
  let weekRow = [];

  // First, add empty cells for the days before the 1st day of the month
  for (let i = 0; i < startDayOfMonth; i++) {
    weekRow.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }

  // Add days of the month to the grid
  while (dayCounter <= daysInMonth) {
    for (let i = startDayOfMonth; i < 7; i++) {
      if (dayCounter > daysInMonth) break;

      const dayKey = `${dayCounter}`;
      const dayValue = selectedDays[dayCounter] || (data && data[dayKey]) || "p"; // Use selectedDays or data from Firestore
      const boxColor = dayValue === "p" ? "green" : dayValue === "a" ? "red" : "gray"; // Color based on 'p' or 'a'

      // Add the day box to the row
      weekRow.push(
        <div
          key={dayCounter}
          className={`calendar-cell day-box ${boxColor}`}
          onClick={((day) => () => toggleDay(day))(dayCounter)} // Use closure to capture the current value of dayCounter
        >
          <div className="day-number">{dayCounter}</div>
        </div>
      );
      dayCounter++;
    }

    // Add the weekRow to rows
    rows.push(<div key={dayCounter} className="calendar-row">{weekRow}</div>);
    weekRow = [];
    startDayOfMonth = 0; // After the first row, reset the starting day of the month
  }

  return rows;
};


  return (
    <div>
      <h1>{monthYear} Calendar</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <button onClick={updateCalendar} className="update-button">
              Update
            </button>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                fontSize: "14px",
              }}
            />
          </div>
          <div className="calendar-container">
            {generateCalendar()}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={generateCalendarRecord} style={{ marginBottom: "20px" }} className="generate-button">
            Generate Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
