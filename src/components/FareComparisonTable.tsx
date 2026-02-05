import { useMemo } from "react";
import { Car, Users, Check } from "lucide-react";
import { taxiTypes, TaxiType } from "@/data/taxiTypes";
import { CityPricing } from "@/data/cityPricing";
import { calculateFare, formatCurrency } from "@/utils/fareCalculator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FareComparisonTableProps {
  city: CityPricing;
  distance: number;
  duration: number;
  isPeakHour: boolean;
  selectedTaxiId?: string;
  onSelectTaxi?: (taxi: TaxiType) => void;
}

const FareComparisonTable = ({
  city,
  distance,
  duration,
  isPeakHour,
  selectedTaxiId,
  onSelectTaxi,
}: FareComparisonTableProps) => {
  const fareComparisons = useMemo(() => {
    if (distance <= 0 || duration <= 0) return [];

    return taxiTypes.map((taxi) => {
      const fare = calculateFare({
        city,
        taxiType: taxi,
        distanceKm: distance,
        durationMinutes: duration,
        isPeakHour,
      });
      return { taxi, fare };
    });
  }, [city, distance, duration, isPeakHour]);

  const cheapestFare = useMemo(() => {
    if (fareComparisons.length === 0) return Infinity;
    return Math.min(...fareComparisons.map((fc) => fc.fare.totalFare));
  }, [fareComparisons]);

  if (fareComparisons.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Enter valid distance and duration to compare fares
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Fare Comparison</h3>
        <Badge variant="secondary" className="ml-auto">
          {city.name}
        </Badge>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground text-center">
                <Users className="w-4 h-4 inline mr-1" />
                Capacity
              </TableHead>
              <TableHead className="text-muted-foreground text-right">Base Fare</TableHead>
              <TableHead className="text-muted-foreground text-right">Distance</TableHead>
              <TableHead className="text-muted-foreground text-right">Time</TableHead>
              <TableHead className="text-muted-foreground text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fareComparisons.map(({ taxi, fare }) => {
              const isCheapest = fare.totalFare === cheapestFare;
              const isSelected = selectedTaxiId === taxi.id;

              return (
                <TableRow
                  key={taxi.id}
                  className={`border-border/30 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 hover:bg-primary/15"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectTaxi?.(taxi)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${taxi.gradient}`}
                      >
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {taxi.name}
                          {isCheapest && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              Cheapest
                            </Badge>
                          )}
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {taxi.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {taxi.capacity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(fare.baseFare, fare.currencySymbol)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(fare.distanceFare, fare.currencySymbol)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(fare.timeFare, fare.currencySymbol)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-bold text-lg ${
                        isCheapest ? "text-green-400" : "text-foreground"
                      }`}
                    >
                      {formatCurrency(fare.totalFare, fare.currencySymbol)}
                    </span>
                    {isPeakHour && (
                      <div className="text-xs text-orange-400">
                        +{formatCurrency(fare.peakMultiplierAmount, fare.currencySymbol)} peak
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground">
        <p>📍 Distance-based fares shown for {distance} km | ⏱️ Rental fares shown for {duration} min</p>
        {isPeakHour && <p className="text-orange-400 mt-1">🔥 Peak hour pricing active</p>}
      </div>
    </div>
  );
};

export default FareComparisonTable;
