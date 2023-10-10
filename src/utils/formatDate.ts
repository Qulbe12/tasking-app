import dayjs from "dayjs";

function formatDate(date: string) {
  return dayjs(date).format("MM/DD/YY HH:mm");
}

export default formatDate;
