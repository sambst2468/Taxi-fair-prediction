import { useState, useMemo } from "react";
import { Car } from "lucide-react";
import { cities, CityPricing } from "@/data/cityPricing";
import { taxiTypes, TaxiType } from "@/data/taxiTypes";
import { calculateFare, FareBreakdown } from "@/utils/fareCalculator";
import { DistanceUnit, DurationUnit, convertToKm, convertToMinutes, distanceUnits, durationUnits } from "@/utils/unitConversions";
import CitySelector from "./CitySelector";
import TaxiCard from "./TaxiCard";
import TripInputs from "./TripInputs";
import FareDisplay from "./FareDisplay";
import FareComparisonTable from "./FareComparisonTable";
import CurrencyConverter from "./CurrencyConverter";

const FareCalculator = () => {
  const [selectedCity, setSelectedCity] = useState<CityPricing>(cities[0]);
  const [selectedTaxi, setSelectedTaxi] = useState<TaxiType>(taxiTypes[1]); // Default to Sedan
  const [distance, setDistance] = useState(10);
  const [duration, setDuration] = useState(30);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("minutes");
  const [isPeakHour, setIsPeakHour] = useState(false);

  // Convert to base units for calculation
  const distanceInKm = useMemo(() => convertToKm(distance, distanceUnit), [distance, distanceUnit]);
  const durationInMinutes = useMemo(() => convertToMinutes(duration, durationUnit), [duration, durationUnit]);

  const fareBreakdown = useMemo<FareBreakdown | null>(() => {
    const isRental = selectedTaxi.id === "rental";
    if ((isRental && durationInMinutes <= 0) || (!isRental && distanceInKm <= 0)) return null;

    return calculateFare({
      city: selectedCity,
      taxiType: selectedTaxi,
      distanceKm: distanceInKm,
      durationMinutes: durationInMinutes,
      isPeakHour,
    });
  }, [selectedCity, selectedTaxi, distanceInKm, durationInMinutes, isPeakHour]);

  const currentDistanceUnit = distanceUnits.find(u => u.value === distanceUnit);
  const currentDurationUnit = durationUnits.find(u => u.value === durationUnit);

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Car className="w-4 h-4" />
            Fare Estimator
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
            Taxi Fare <span className="text-primary">Calculator</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Get accurate fare estimates for your rides across major cities with different taxi types
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* City Selection */}
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CitySelector
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
              />
            </div>

            {/* Taxi Type Selection */}
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                Choose Taxi Type
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {taxiTypes.map((taxi) => (
                  <TaxiCard
                    key={taxi.id}
                    taxi={taxi}
                    isSelected={selectedTaxi.id === taxi.id}
                    onClick={() => setSelectedTaxi(taxi)}
                    currencySymbol={selectedCity.currencySymbol}
                    cityMultiplier={selectedCity.baseMultiplier}
                  />
                ))}
              </div>
            </div>

            {/* Trip Details */}
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Trip Details
              </h3>
              <TripInputs
                distance={distance}
                duration={duration}
                distanceUnit={distanceUnit}
                durationUnit={durationUnit}
                isPeakHour={isPeakHour}
                isRental={selectedTaxi.id === "rental"}
                onDistanceChange={setDistance}
                onDurationChange={setDuration}
                onDistanceUnitChange={setDistanceUnit}
                onDurationUnitChange={setDurationUnit}
                onPeakHourChange={setIsPeakHour}
              />
            </div>
          </div>

          {/* Right Column - Fare Display */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="sticky top-8">
              <FareDisplay
                fareBreakdown={fareBreakdown}
                taxiType={selectedTaxi}
                city={selectedCity}
                distance={distance}
                duration={duration}
                distanceUnit={currentDistanceUnit?.shortLabel || "km"}
                durationUnit={currentDurationUnit?.shortLabel || "min"}
                isPeakHour={isPeakHour}
              />
            </div>
          </div>
        </div>

        {/* Fare Comparison Table */}
        <div className="animate-slide-up mt-6" style={{ animationDelay: "0.5s" }}>
          <FareComparisonTable
            city={selectedCity}
            distance={distanceInKm}
            duration={durationInMinutes}
            isPeakHour={isPeakHour}
            selectedTaxiId={selectedTaxi.id}
            onSelectTaxi={setSelectedTaxi}
          />
        </div>

        {/* Currency Converter */}
        {fareBreakdown && (
          <div className="animate-slide-up mt-6" style={{ animationDelay: "0.6s" }}>
            <CurrencyConverter
              amount={fareBreakdown.totalFare}
              sourceCurrency={selectedCity.currency}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Fares are estimates and may vary based on traffic conditions</p>
        </footer>
      </div>
    </div>
  );
};

export default FareCalculator;
