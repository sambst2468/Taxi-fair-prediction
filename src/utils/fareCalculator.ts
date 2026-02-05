import { CityPricing } from "@/data/cityPricing";
import { TaxiType } from "@/data/taxiTypes";

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  cityMultiplierAmount: number;
  peakMultiplierAmount: number;
  totalFare: number;
  currency: string;
  currencySymbol: string;
}

export interface FareCalculationInput {
  city: CityPricing;
  taxiType: TaxiType;
  distanceKm: number;
  durationMinutes: number;
  isPeakHour: boolean;
}

export const calculateFare = ({
  city,
  taxiType,
  distanceKm,
  durationMinutes,
  isPeakHour,
}: FareCalculationInput): FareBreakdown => {
  const isRental = taxiType.id === "rental";
  
  // Base calculations
  const baseFare = taxiType.basePrice;
  
  // For rental: only time-based, for others: only distance-based
  const distanceFare = isRental ? 0 : distanceKm * taxiType.perKmRate;
  const timeFare = isRental ? durationMinutes * taxiType.perMinRate : 0;

  // Subtotal before multipliers
  let subtotal = baseFare + distanceFare + timeFare;

  // Apply city multiplier
  const cityMultiplierAmount = subtotal * (city.baseMultiplier - 1);
  subtotal = subtotal * city.baseMultiplier;

  // Apply peak hour multiplier if applicable
  let peakMultiplierAmount = 0;
  if (isPeakHour) {
    peakMultiplierAmount = subtotal * (city.peakHourMultiplier - 1);
    subtotal = subtotal * city.peakHourMultiplier;
  }

  // Ensure minimum fare
  const totalFare = Math.max(subtotal, taxiType.minFare * city.baseMultiplier);

  return {
    baseFare: Math.round(baseFare),
    distanceFare: Math.round(distanceFare),
    timeFare: Math.round(timeFare),
    cityMultiplierAmount: Math.round(cityMultiplierAmount),
    peakMultiplierAmount: Math.round(peakMultiplierAmount),
    totalFare: Math.round(totalFare),
    currency: city.currency,
    currencySymbol: city.currencySymbol,
  };
};

export const formatCurrency = (amount: number, symbol: string): string => {
  return `${symbol}${amount.toLocaleString("en-IN")}`;
};
