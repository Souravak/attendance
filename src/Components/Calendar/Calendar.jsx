import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "./../firebaseConfig";
import "./Calendar.css";

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Calendar = ({ monthYear }) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  // Fetch data from Firestore for all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = ["ajay", "amal", "aravind", "jazeel", "manu", "mithun", "sreekanth", "sourav"];
        const allData = {};

        for (const user of users) {
          const docRef = doc(db, user, monthYear);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            allData[user] = docSnap.data();
          } else {
            allData[user] = {}; // Default to empty object if no data is found
          }
        }
        setData(allData);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      }
    };

    if (monthYear) {
      fetchData();
    }
  }, [monthYear]);

  // Generate the calendar layout
  const generateCalendar = () => {
    const [monthName, year] = monthYear.split("-");
    const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const rows = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const weekday = weekdays[date.getDay()];
      rows.push({ day, weekday });
    }
    return rows;
  };

  const calendarDays = generateCalendar();

  // Get color based on value
  const getColorClass = (value) => {
    if (value === "p") return "present";
    if (value === "a") return "absent";
    return "";
  };

  return (
    <div>
      <h1>{monthYear} Calendar</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="calendar-grid">
          {/* Render user names at the top */}
          <div className="calendar-row">
            <div className="calendar-cell header">Day</div>
            <div className="calendar-cell header">Day</div>
            {Object.keys(data).map((user) => (
              <div key={user} className="calendar-cell header user-name">
                {user}
              </div>
            ))}
          </div>

          {/* Render the days and user data */}
          {calendarDays.map(({ day, weekday }) => (
            <div key={day} className="calendar-row">
              <div className="calendar-cell day-number">{day}</div>
              <div className="calendar-cell day-name">{weekday}</div>
              {Object.keys(data).map((user) => (
                <div
                  key={`${user}-${day}`}
                  className={`calendar-cell ${getColorClass(data[user]?.[day.toString()])}`}
                >
                  {data[user]?.[day.toString()] || ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
