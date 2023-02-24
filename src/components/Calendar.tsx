import React from "react";
import getDates from "../utils/getDates";
import getTimes from "../utils/getTimes";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const dates = getDates(new Date("2023-02-20"), new Date("2023-02-26"));

  return (
    <div className="calendar-container">
      <div className="header">
        <div className="header-item" />

        {dates.map((d, i) => {
          console.log(d);

          return (
            <div key={i} className="header-item">
              <p> {d.getDate()}</p>
              <p>{days[d.getDay()]}</p>
            </div>
          );
        })}
      </div>

      <div className="body">
        {getTimes().map((t) => {
          return (
            <div key={t} className="body-row">
              <div className="body-cell">{t}</div>
              {dates.map((d, i) => {
                return (
                  <div key={i + "cell"} className="body-cell">
                    <div className="sub-cell"></div>
                    <div className="sub-cell"></div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
