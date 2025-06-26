import { z } from "zod";
import { PlayerSchema } from "./schemas.ts";

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
    { value: "Goalkeeper", label: "Goalkeeper" },
    { value: "Defender", label: "Defender" },
    { value: "Midfielder", label: "Midfielder" },
    { value: "Forward", label: "Forward" },
] as const;

export const DEFAULT_AVAILABILITY = {
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
