import { z } from "zod";
import { PlayerSchema, TrainingBlockSchema } from "./schemas.ts";

export const DEFAULT_PLAYER: z.infer<typeof PlayerSchema> = {
  name: "",
  number: 0,
  position: "Goalkeeper",
  availabilities: [],
} as const;

export const DEFAULT_TRAINING_BLOCK: z.infer<typeof TrainingBlockSchema> = {
  day: "Monday",
  start: "8:00AM",
  end: "9:00AM",
};

export const POSITIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
