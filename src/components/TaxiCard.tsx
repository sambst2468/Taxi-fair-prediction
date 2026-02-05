import { Car, Truck, Crown, Clock, Sparkles, Users } from "lucide-react";
import { TaxiType } from "@/data/taxiTypes";
import { cn } from "@/lib/utils";

interface TaxiCardProps {
  taxi: TaxiType;
  isSelected: boolean;
  onClick: () => void;
  currencySymbol: string;
  cityMultiplier: number;
}

const iconMap = {
  mini: Car,
  sedan: Car,
  premium: Crown,
  suv: Truck,
  rental: Clock,
};

const TaxiCard = ({ taxi, isSelected, onClick, currencySymbol, cityMultiplier }: TaxiCardProps) => {
  const Icon = iconMap[taxi.icon as keyof typeof iconMap] || Car;
  const adjustedRate = Math.round(taxi.perKmRate * cityMultiplier);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-xl transition-all duration-300 group",
        "border-2 text-left",
        isSelected
          ? "border-primary glass-card glow-primary scale-[1.02]"
          : "border-border/50 bg-card/50 hover:border-border hover:bg-card/80"
      )}
    >
      {/* Gradient accent */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-0 transition-opacity duration-300",
          taxi.gradient,
          isSelected && "opacity-100"
        )}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              isSelected ? taxi.gradient : "bg-secondary",
              isSelected ? "text-background" : taxi.colorClass
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">{taxi.name}</h3>
            <p className="text-sm text-muted-foreground">{taxi.description}</p>
          </div>
        </div>

        <div className="text-right">
          <p className={cn("font-display font-bold", isSelected ? "text-primary" : "text-foreground")}>
            {currencySymbol}{adjustedRate}/km
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Users className="w-3 h-3" />
            <span>{taxi.capacity}</span>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -right-1 -top-1">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
      )}
    </button>
  );
};

export default TaxiCard;
