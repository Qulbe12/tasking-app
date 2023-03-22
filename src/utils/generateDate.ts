function generateDate(miliSeconds: number) {
  const monthNames = [
    "jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const emailDate = new Date(miliSeconds * 1000);

  let newDate = `${monthNames[emailDate.getMonth()]} ${emailDate.getDate()}`;

  const currDate = new Date();

  if (
    emailDate.getDate() === currDate.getDate() &&
    emailDate.getDay() === currDate.getDay() &&
    emailDate.getMonth() === currDate.getMonth()
  ) {
    newDate = `${emailDate.getHours()}:${emailDate.getMinutes()}`;
  }

  return newDate;
}

export default generateDate;
