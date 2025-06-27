export const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.slice(0, -2).split(":").map(Number);
  const period = timeStr.slice(-2).toUpperCase();

  let totalHours = hours;
  if (period === "AM" && hours === 12) {
    totalHours = 0;
  } else if (period === "PM" && hours !== 12) {
    totalHours = hours + 12;
  }

  return totalHours * 60 + minutes;
};
