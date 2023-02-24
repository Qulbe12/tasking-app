const getTimes = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    if (hour < 12) {
      const hourString = hour === 0 ? "12" : hour.toString();
      times.push(`${hourString}:00 AM`);
    } else {
      const hourString = hour - 12 === 0 ? "12" : (hour - 12).toString();
      times.push(`${hourString}:00 PM`);
    }
  }
  return times;
};

export default getTimes;
