import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FareBreakdown, formatCurrency } from "@/utils/fareCalculator";
import { TaxiType } from "@/data/taxiTypes";
import { CityPricing } from "@/data/cityPricing";
import { useToast } from "@/hooks/use-toast";

interface ShareFareProps {
  fareBreakdown: FareBreakdown | null;
  taxiType: TaxiType;
  city: CityPricing;
  distance: number;
  duration: number;
  distanceUnit: string;
  durationUnit: string;
  isPeakHour: boolean;
}

const ShareFare = ({
  fareBreakdown,
  taxiType,
  city,
  distance,
  duration,
  distanceUnit,
  durationUnit,
  isPeakHour,
}: ShareFareProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!fareBreakdown) return null;

  const isRental = taxiType.id === "rental";
  
  const generateShareText = () => {
    const tripInfo = isRental 
      ? `Duration: ${duration} ${durationUnit}`
      : `Distance: ${distance} ${distanceUnit}`;
    
    return `🚕 Taxi Fare Estimate

📍 City: ${city.name}, ${city.country}
🚗 Taxi Type: ${taxiType.name}
${tripInfo}
${isPeakHour ? "⚡ Peak Hour: Yes\n" : ""}
💰 Estimated Fare: ${formatCurrency(fareBreakdown.totalFare, fareBreakdown.currencySymbol)}

Calculated using Taxi Fare Calculator`;
  };

  const handleCopy = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Fare details copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Taxi Fare Estimate - ${city.name}`);
    const body = encodeURIComponent(generateShareText());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border/50 hover:bg-primary/10 hover:text-primary"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer gap-2">
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          Copy to Clipboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp} className="cursor-pointer gap-2">
          <MessageCircle className="w-4 h-4 text-green-500" />
          Share via WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail} className="cursor-pointer gap-2">
          <Mail className="w-4 h-4 text-blue-400" />
          Share via Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareFare;
