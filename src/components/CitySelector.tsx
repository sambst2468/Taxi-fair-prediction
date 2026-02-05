import { MapPin, Globe } from "lucide-react";
import { cities, CityPricing, getIndianCities, getInternationalCities } from "@/data/cityPricing";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitySelectorProps {
  selectedCity: CityPricing;
  onCityChange: (city: CityPricing) => void;
}

const CitySelector = ({ selectedCity, onCityChange }: CitySelectorProps) => {
  const indianCities = getIndianCities();
  const internationalCities = getInternationalCities();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Select City
      </label>
      <Select
        value={selectedCity.id}
        onValueChange={(value) => {
          const city = cities.find((c) => c.id === value);
          if (city) onCityChange(city);
        }}
      >
        <SelectTrigger className="w-full h-12 bg-card border-border/50 hover:border-border transition-colors">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedCity.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedCity.country} ({selectedCity.currencySymbol})
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-border max-h-80">
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2 text-primary">
              <MapPin className="w-3 h-3" />
              Indian Cities
            </SelectLabel>
            {indianCities.map((city) => (
              <SelectItem
                key={city.id}
                value={city.id}
                className="hover:bg-secondary focus:bg-secondary cursor-pointer"
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {city.baseMultiplier > 1 ? "+" : ""}
                    {Math.round((city.baseMultiplier - 1) * 100)}%
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2 text-primary mt-2">
              <Globe className="w-3 h-3" />
              International Cities
            </SelectLabel>
            {internationalCities.map((city) => (
              <SelectItem
                key={city.id}
                value={city.id}
                className="hover:bg-secondary focus:bg-secondary cursor-pointer"
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <div>
                    <span className="font-medium">{city.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {city.country}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {city.currencySymbol}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
