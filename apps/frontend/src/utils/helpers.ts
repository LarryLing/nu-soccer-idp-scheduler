/**
 * Description
 * @param {string} timeStr:string
 * @returns {number}
 * @description Parses a time string in the format "HH:MMAM" or "HH:MMPM"
 * and returns the total number of minutes since midnight.
 * For example, "01:30PM" returns 870 (13 hours * 60 + 30 minutes).
 * "12:00AM" returns 0, and "12:00PM" returns 720.
 * @example
 * parseTime("01:30PM"); // returns 870
 * parseTime("12:00AM"); // returns 0
 * parseTime("12:00PM"); // returns 720
 */
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

/**
 * Description
 * @param {string} prevTime - The previous time in "HH:MMAM" or "HH:MMPM" format.
 * @returns {string[]} - An array containing the next start and end times in the same format.
 * @description Generates the next start and end times based on the previous time.
 * The next start time is one hour after the previous time, and the end time is two hours after the previous time.
 * The times are returned in "HH:MMAM" or "HH:MMPM" format.
 * @example
 * generateNextTimes("01:30PM"); // returns ["02:30PM", "03:30PM"]
 * generateNextTimes("12:00AM"); // returns ["01:00AM", "02:00AM"]
 * generateNextTimes("12:00PM"); // returns ["01:00PM", "02:00PM"]
 */
export const generateNextTimes = (prevTime: string) => {
  const [timeStr, period] = [
    prevTime.slice(0, -2),
    prevTime.slice(-2).toUpperCase(),
  ];
  const [hours, minutes] = timeStr.split(":").map(Number);

  let totalHours = hours;
  if (period === "AM" && hours === 12) {
    totalHours = 0;
  } else if (period === "PM" && hours !== 12) {
    totalHours = hours + 12;
  }

  const formatTime = (hour24: number, mins: number) => {
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 < 12 ? "AM" : "PM";
    const paddedMins = mins.toString().padStart(2, "0");
    return `${hour12}:${paddedMins}${period}`;
  };

  const nextStartHour = (totalHours + 1) % 24;
  const nextEndHour = (totalHours + 2) % 24;

  return [formatTime(nextStartHour, minutes), formatTime(nextEndHour, minutes)];
};
