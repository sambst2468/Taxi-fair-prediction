import { Car, Truck, Crown, Clock, Sparkles } from "lucide-react";

export interface TaxiType {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Base price per km in INR
  perKmRate: number;
  perMinRate: number;
  minFare: number;
  capacity: number;
  icon: string;
  gradient: string;
  colorClass: string;
}

export const taxiTypes: TaxiType[] = [
  {
    id: "mini",
    name: "Mini",
    description: "Compact & affordable",
    basePrice: 40,
    perKmRate: 9,
    perMinRate: 1,
    minFare: 50,
    capacity: 3,
    icon: "mini",
    gradient: "taxi-gradient-mini",
    colorClass: "text-taxi-mini",
  },
  {
    id: "sedan",
    name: "Sedan",
    description: "Comfortable rides",
    basePrice: 60,
    perKmRate: 13,
    perMinRate: 1.5,
    minFare: 80,
    capacity: 4,
    icon: "sedan",
    gradient: "taxi-gradient-sedan",
    colorClass: "text-taxi-sedan",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury experience",
    basePrice: 100,
    perKmRate: 20,
    perMinRate: 2.5,
    minFare: 150,
    capacity: 4,
    icon: "premium",
    gradient: "taxi-gradient-premium",
    colorClass: "text-taxi-premium",
  },
  {
    id: "suv",
    name: "SUV",
    description: "Spacious & powerful",
    basePrice: 120,
    perKmRate: 18,
    perMinRate: 2,
    minFare: 180,
    capacity: 6,
    icon: "suv",
    gradient: "taxi-gradient-suv",
    colorClass: "text-taxi-suv",
  },
  {
    id: "rental",
    name: "Rental",
    description: "Hourly packages",
    basePrice: 250,
    perKmRate: 12,
    perMinRate: 4,
    minFare: 500,
    capacity: 4,
    icon: "rental",
    gradient: "taxi-gradient-rental",
    colorClass: "text-taxi-rental",
  },
];

export const getTaxiById = (id: string): TaxiType | undefined => {
  return taxiTypes.find(taxi => taxi.id === id);
};
