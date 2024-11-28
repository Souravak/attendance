import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "./../firebaseConfig"; // Import your config file
import "./Calendar.css"; // Ensure your styles are correct

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Calendar = ({ monthYear }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState({}); // Track changes on selected days

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "sourav", monthYear);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fields = docSnap.data();
          setData(fields);
        } else {
          setError("No document found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (monthYear) {
      fetchData();
    }
  }, [monthYear]); // Re-fetch when `monthYear` prop changes

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

  // Function to reset all days in November (1 to 30) to 'p'
  const resetMonth = async () => {
    try {
      const docRef = doc(db, "sourav", monthYear);

      let updateData = {};
      for (let i = 1; i <= 30; i++) {
        updateData[i.toString()] = "p";
      }

      await updateDoc(docRef, updateData);
      alert(`${monthYear} reset to 'p' for all days!`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update Firebase with the selected days
  const updateCalendar = async () => {
    try {
      const docRef = doc(db, "sourav", monthYear);

      // Update Firebase with selected days
      await updateDoc(docRef, selectedDays);
      alert("Calendar updated successfully!");
    } catch (err) {
      setError("Error updating the calendar: " + err.message);
    }
  };

  // Generate the calendar layout for November (30 days)
  const generateCalendar = () => {
    var daysInMonth = 30;
    var startDayOfMonth = 5; // Friday (0=Sunday, 1=Monday, ..., 5=Friday)
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"]; // Weekday headers
    const rows = [];

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

    // Add the days (1 to 30) to the calendar grid
    let dayCounter = 1;
    let weekRow = [];

    // First, add empty cells for the days before November 1st
    for (let i = 0; i < startDayOfMonth; i++) {
      weekRow.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Add days of the month to the grid
    while (dayCounter <= daysInMonth) {
      for (let i = startDayOfMonth; i < 7; i++) {
        if (dayCounter > daysInMonth) break;

        // We now ensure that the dayCounter value is captured correctly within the loop
        const dayKey = `${dayCounter}`;
        const dayValue = selectedDays[dayCounter] || (data && data[dayKey]) || "p"; // Use selectedDays if available, otherwise data from Firestore
        const boxColor = dayValue === "p" ? "green" : dayValue === "a" ? "red" : "gray"; // Color based on 'p' or 'a'

        // Directly pass `dayCounter` as an argument to ensure correct closure
        weekRow.push(
          <div
            key={dayCounter}
            className={`calendar-cell day-box ${boxColor}`}
            onClick={((day) => () => toggleDay(day))(dayCounter)} // Use a closure to capture the current value of dayCounter
          >
            <div className="day-number">{dayCounter}</div>
          </div>
        );
        dayCounter++;
      }

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
          <button onClick={resetMonth} style={{ marginBottom: "20px" }} className="reset-button">
            Reset this Month
          </button>
          <div className="calendar-container">
            {generateCalendar()}
          </div>
          <button onClick={updateCalendar} style={{ marginTop: "20px" }} className="update-button">
            Update
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Calendar;
