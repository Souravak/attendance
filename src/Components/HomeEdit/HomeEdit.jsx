import React, { useState } from 'react';
import CalendarEdit from '../CalendarEdit/CalendarEdit';
import './HomeEdit.css';

const HomeEdit = () => {
  
  // Get the current month and year to set default values
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based (January = 0)
  const currentYear = currentDate.getFullYear();

  const [selectedUser, setSelectedUser] = useState('ajay'); // Default user
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Store the selected month
  const [selectedYear, setSelectedYear] = useState(currentYear); // Store the selected year
  const [calendarMonthYear, setCalendarMonthYear] = useState(`${currentDate.toLocaleString('default', { month: 'long' }).toLowerCase()}-${currentYear}`); // Format "november-2024"
  const [showCalendar, setShowCalendar] = useState(false); // State to manage showing the calendar

  // Handle the dropdown changes
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value); // Update selected user
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle the button click to update the calendar
  const handleGetCalendar = () => {
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }).toLowerCase();
    setCalendarMonthYear(`${monthName}-${selectedYear}`);
    setShowCalendar(true); // Show the calendar when button is clicked
  };

  // Create month, year, and user options
  const months = [
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"
  ];

  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i); // 10 years before and 10 years after the current year

  const users = ["ajay", "amal", "aravind", "jazeel", "manu", "mithun", "sreekanth", "sourav"]; // Example user list


  return (
    <div className="home-container">
      <h1>HomeEdit</h1>

      <div className="select-section">
        <div className="select-fields">
          <label htmlFor="user">Select User:</label>
          <select id="user" value={selectedUser} onChange={handleUserChange}>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="select-fields">
          <label htmlFor="month">Select Month:</label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="select-fields">
          <label htmlFor="year">Select Year:</label>
          <select id="year" value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={handleGetCalendar}>Get Calendar</button>


      {showCalendar && (
        <CalendarEdit
          key={calendarMonthYear} // Use key prop to force re-render when monthYear changes
          monthYear={calendarMonthYear.toLowerCase()}
          username={selectedUser} // Pass username to Calendar
        />
      )}
    </div>
  );
};

export default HomeEdit;
