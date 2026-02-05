import { Receipt, Zap, MapPin, Clock, Car } from "lucide-react";
import { FareBreakdown, formatCurrency } from "@/utils/fareCalculator";
import { TaxiType } from "@/data/taxiTypes";
import { CityPricing } from "@/data/cityPricing";
import { cn } from "@/lib/utils";
import ShareFare from "./ShareFare";

interface FareDisplayProps {
  fareBreakdown: FareBreakdown | null;
  taxiType: TaxiType;
  city: CityPricing;
  distance: number;
  duration: number;
  distanceUnit: string;
  durationUnit: string;
  isPeakHour: boolean;
}

const FareDisplay = ({
  fareBreakdown,
  taxiType,
  city,
  distance,
  duration,
  distanceUnit,
  durationUnit,
  isPeakHour,
}: FareDisplayProps) => {
  const isRental = taxiType.id === "rental";

  if (!fareBreakdown || (isRental && duration <= 0) || (!isRental && distance <= 0)) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          {isRental ? "Enter duration to calculate rental fare" : "Enter distance to calculate fare"}
        </p>
      </div>
    );
  }

  const { currencySymbol } = fareBreakdown;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main fare card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        {/* Gradient background */}
        <div
          className={cn(
            "absolute inset-0 opacity-10",
            taxiType.gradient
          )}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="w-4 h-4" />
              <span className="text-sm font-medium">Estimated Fare</span>
            </div>
            <div className="flex items-center gap-2">
              {isPeakHour && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  <Zap className="w-3 h-3" />
                  Peak Hour
                </div>
              )}
              <ShareFare
                fareBreakdown={fareBreakdown}
                taxiType={taxiType}
                city={city}
                distance={distance}
                duration={duration}
                distanceUnit={distanceUnit}
                durationUnit={durationUnit}
                isPeakHour={isPeakHour}
              />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-display font-bold text-foreground">
              {formatCurrency(fareBreakdown.totalFare, currencySymbol)}
            </span>
          </div>

          {/* Trip summary */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {!isRental && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{distance} {distanceUnit}</span>
              </div>
            )}
            {isRental && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{duration} {durationUnit}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-primary" />
              <span>{taxiType.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown card */}
      <div className="bg-card/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Fare Breakdown
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Fare</span>
            <span className="text-foreground">
              {formatCurrency(fareBreakdown.baseFare, currencySymbol)}
            </span>
          </div>

          {!isRental && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Distance ({distance} {distanceUnit})</span>
              <span className="text-foreground">
                {formatCurrency(fareBreakdown.distanceFare, currencySymbol)}
              </span>
            </div>
          )}

          {isRental && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time ({duration} {durationUnit})</span>
              <span className="text-foreground">
                {formatCurrency(fareBreakdown.timeFare, currencySymbol)}
              </span>
            </div>
          )}

          {fareBreakdown.cityMultiplierAmount !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{city.name} Adjustment</span>
              <span className={fareBreakdown.cityMultiplierAmount > 0 ? "text-taxi-rental" : "text-taxi-mini"}>
                {fareBreakdown.cityMultiplierAmount > 0 ? "+" : ""}
                {formatCurrency(fareBreakdown.cityMultiplierAmount, currencySymbol)}
              </span>
            </div>
          )}

          {fareBreakdown.peakMultiplierAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                Peak Hour Surge
              </span>
              <span className="text-taxi-rental">
                +{formatCurrency(fareBreakdown.peakMultiplierAmount, currencySymbol)}
              </span>
            </div>
          )}

          <div className="h-px bg-border my-2" />

          <div className="flex justify-between font-medium">
            <span className="text-foreground">Total</span>
            <span className="text-primary font-display text-lg">
              {formatCurrency(fareBreakdown.totalFare, currencySymbol)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FareDisplay;
