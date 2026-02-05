import { MapPin, Clock, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DistanceUnit,
  DurationUnit,
  distanceUnits,
  durationUnits,
  getMaxDistance,
  getMaxDuration,
  getStepValue,
} from "@/utils/unitConversions";

interface TripInputsProps {
  distance: number;
  duration: number;
  distanceUnit: DistanceUnit;
  durationUnit: DurationUnit;
  isPeakHour: boolean;
  isRental: boolean;
  onDistanceChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
  onDurationUnitChange: (unit: DurationUnit) => void;
  onPeakHourChange: (value: boolean) => void;
}

const TripInputs = ({
  distance,
  duration,
  distanceUnit,
  durationUnit,
  isPeakHour,
  isRental,
  onDistanceChange,
  onDurationChange,
  onDistanceUnitChange,
  onDurationUnitChange,
  onPeakHourChange,
}: TripInputsProps) => {
  const maxDistance = getMaxDistance(distanceUnit);
  const maxDuration = getMaxDuration(durationUnit);

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxDistance) {
      onDistanceChange(value);
    } else if (e.target.value === "") {
      onDistanceChange(0);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxDuration) {
      onDurationChange(value);
    } else if (e.target.value === "") {
      onDurationChange(0);
    }
  };

  const currentDistanceUnit = distanceUnits.find(u => u.value === distanceUnit);
  const currentDurationUnit = durationUnits.find(u => u.value === durationUnit);

  return (
    <div className="space-y-6">
      {/* Distance input - shown for non-rental taxis */}
      {!isRental && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Distance
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={distance || ""}
              onChange={handleDistanceChange}
              placeholder={`Enter distance`}
              min={0}
              max={maxDistance}
              step={getStepValue(distanceUnit)}
              className="h-12 bg-card border-border/50 text-foreground flex-1"
            />
            <Select value={distanceUnit} onValueChange={(v) => onDistanceUnitChange(v as DistanceUnit)}>
              <SelectTrigger className="w-28 h-12 bg-card border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {distanceUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Max: {maxDistance} {currentDistanceUnit?.shortLabel}
          </p>
        </div>
      )}

      {/* Duration input - shown for rental taxis */}
      {isRental && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Duration
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={duration || ""}
              onChange={handleDurationChange}
              placeholder={`Enter duration`}
              min={0}
              max={maxDuration}
              step={getStepValue(durationUnit)}
              className="h-12 bg-card border-border/50 text-foreground flex-1"
            />
            <Select value={durationUnit} onValueChange={(v) => onDurationUnitChange(v as DurationUnit)}>
              <SelectTrigger className="w-28 h-12 bg-card border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {durationUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Max: {maxDuration} {currentDurationUnit?.shortLabel}
          </p>
        </div>
      )}

      {/* Peak hour toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isPeakHour ? "bg-primary/20" : "bg-secondary"}`}>
            <Zap className={`w-4 h-4 transition-colors ${isPeakHour ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground cursor-pointer">
              Peak Hour
            </Label>
            <p className="text-xs text-muted-foreground">
              Higher rates during rush hours
            </p>
          </div>
        </div>
        <Switch
          checked={isPeakHour}
          onCheckedChange={onPeakHourChange}
        />
      </div>
    </div>
  );
};

export default TripInputs;
