import type z from "zod";
import type { TrainingBlockSchema } from "./schemas";
import type { TrainingBlock } from "./types";

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

export const validatePassword = (password: string) => ({
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[!@#$%^&*]/.test(password),
});

export const validateTimeOrder = (data: { start: string; end: string }) =>
  parseTime(data.end) > parseTime(data.start);

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

export const checkTrainingBlockOverlaps = (
  trainingBlocks: TrainingBlock[],
  submittedTrainingBlock: z.infer<typeof TrainingBlockSchema>,
  trainingBlockId?: string,
): boolean => {
  const filteredTrainingBlocks = trainingBlocks.filter(
    (block) =>
      block.day === submittedTrainingBlock.day && block.id !== trainingBlockId,
  );

  const submittedStart = parseTime(submittedTrainingBlock.start);
  const submittedEnd = parseTime(submittedTrainingBlock.end);

  return filteredTrainingBlocks.some((block) => {
    const blockStart = parseTime(block.start);
    const blockEnd = parseTime(block.end);
    return submittedStart < blockEnd && blockStart < submittedEnd;
  });
};
