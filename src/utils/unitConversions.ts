export type DistanceUnit = "km" | "miles" | "meters";
export type DurationUnit = "minutes" | "hours" | "days";

export const distanceUnits: { value: DistanceUnit; label: string; shortLabel: string }[] = [
  { value: "km", label: "Kilometers", shortLabel: "km" },
  { value: "miles", label: "Miles", shortLabel: "mi" },
  { value: "meters", label: "Meters", shortLabel: "m" },
];

export const durationUnits: { value: DurationUnit; label: string; shortLabel: string }[] = [
  { value: "minutes", label: "Minutes", shortLabel: "min" },
  { value: "hours", label: "Hours", shortLabel: "hrs" },
  { value: "days", label: "Days", shortLabel: "days" },
];

// Convert any distance unit to kilometers (base unit for fare calculation)
export const convertToKm = (value: number, unit: DistanceUnit): number => {
  switch (unit) {
    case "km":
      return value;
    case "miles":
      return value * 1.60934;
    case "meters":
      return value / 1000;
    default:
      return value;
  }
};

// Convert kilometers to any distance unit
export const convertFromKm = (km: number, unit: DistanceUnit): number => {
  switch (unit) {
    case "km":
      return km;
    case "miles":
      return km / 1.60934;
    case "meters":
      return km * 1000;
    default:
      return km;
  }
};

// Convert any duration unit to minutes (base unit for fare calculation)
export const convertToMinutes = (value: number, unit: DurationUnit): number => {
  switch (unit) {
    case "minutes":
      return value;
    case "hours":
      return value * 60;
    case "days":
      return value * 24 * 60;
    default:
      return value;
  }
};

// Convert minutes to any duration unit
export const convertFromMinutes = (minutes: number, unit: DurationUnit): number => {
  switch (unit) {
    case "minutes":
      return minutes;
    case "hours":
      return minutes / 60;
    case "days":
      return minutes / (24 * 60);
    default:
      return minutes;
  }
};

// Get max values for input fields based on unit
export const getMaxDistance = (unit: DistanceUnit): number => {
  switch (unit) {
    case "km":
      return 500;
    case "miles":
      return 310; // ~500km
    case "meters":
      return 500000;
    default:
      return 500;
  }
};

export const getMaxDuration = (unit: DurationUnit): number => {
  switch (unit) {
    case "minutes":
      return 1440; // 24 hours
    case "hours":
      return 24;
    case "days":
      return 7;
    default:
      return 1440;
  }
};

export const getStepValue = (unit: DistanceUnit | DurationUnit): number => {
  switch (unit) {
    case "km":
    case "miles":
      return 0.5;
    case "meters":
      return 100;
    case "minutes":
      return 5;
    case "hours":
      return 0.5;
    case "days":
      return 0.5;
    default:
      return 1;
  }
};
