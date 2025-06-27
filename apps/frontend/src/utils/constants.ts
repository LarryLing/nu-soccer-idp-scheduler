import { z } from "zod";
import { AvailabilitySchema, PlayerSchema } from "./schemas.ts";

export const DEFAULT_VALUES: z.infer<typeof PlayerSchema> = {
  name: "",
  number: 0,
  position: "Goalkeeper",
  availabilities: [
    {
      day: "Monday",
      start: "9:30AM",
      end: "10:00AM",
    },
  ],
} as const;

export const POSITION_OPTIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
] as const;

export const DEFAULT_AVAILABILITY: z.infer<typeof AvailabilitySchema> = {
  day: "Monday",
  start: "9:30AM",
  end: "10:00AM",
} as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
