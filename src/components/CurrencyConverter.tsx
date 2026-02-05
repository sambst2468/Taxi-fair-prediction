import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ChevronDown, ChevronUp, Globe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  currencies,
  CurrencyInfo,
  convertCurrency,
  formatConvertedCurrency,
  getPopularCurrencies,
  fetchLiveExchangeRates,
  fallbackRates,
} from "@/utils/currencyConverter";
import { useToast } from "@/hooks/use-toast";

interface CurrencyConverterProps {
  amount: number;
  sourceCurrency: string;
}

const CurrencyConverter = ({ amount, sourceCurrency }: CurrencyConverterProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    getPopularCurrencies(sourceCurrency).map((c) => c.code)
  );
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const { toast } = useToast();

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchLiveExchangeRates(sourceCurrency);
      
      if (response.success && Object.keys(response.rates).length > 0) {
        setRates(response.rates);
        setLastUpdated(response.lastUpdated);
        setIsLive(true);
        toast({
          title: "Rates Updated",
          description: "Live exchange rates loaded successfully",
        });
      } else {
        setRates(fallbackRates);
        setIsLive(false);
        toast({
          title: "Using Fallback Rates",
          description: "Could not fetch live rates, using approximate values",
          variant: "destructive",
        });
      }
    } catch (error) {
      setRates(fallbackRates);
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, [sourceCurrency, toast]);

  // Fetch rates on mount and when source currency changes
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const availableCurrencies = currencies.filter((c) => c.code !== sourceCurrency);
  const displayCurrencies = showAll
    ? availableCurrencies.filter((c) => selectedCurrencies.includes(c.code))
    : availableCurrencies
        .filter((c) => selectedCurrencies.includes(c.code))
        .slice(0, 6);

  const toggleCurrency = (code: string) => {
    setSelectedCurrencies((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const selectAll = () => {
    setSelectedCurrencies(availableCurrencies.map((c) => c.code));
  };

  const selectNone = () => {
    setSelectedCurrencies([]);
  };

  if (amount <= 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Currency Converter
              </h3>
              {isLive ? (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                  LIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                  Approximate
                </span>
              )}
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          {/* Currency Selection */}
          <div className="mb-4 p-3 bg-card/50 rounded-xl border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Select currencies to display
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs h-7 px-2"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectNone}
                  className="text-xs h-7 px-2"
                >
                  None
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={currency.code}
                    checked={selectedCurrencies.includes(currency.code)}
                    onCheckedChange={() => toggleCurrency(currency.code)}
                  />
                  <Label
                    htmlFor={currency.code}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {currency.code}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Converted Amounts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">Fetching live rates...</span>
            </div>
          ) : selectedCurrencies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {displayCurrencies.map((currency) => {
                const convertedAmount = convertCurrency(
                  amount,
                  sourceCurrency,
                  currency.code,
                  rates
                );
                return (
                  <div
                    key={currency.code}
                    className="p-3 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {currency.code}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {formatConvertedCurrency(convertedAmount, currency.code)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {currency.name}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Select currencies above to see conversions
            </div>
          )}

          {/* Show More/Less */}
          {selectedCurrencies.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-3 text-muted-foreground hover:text-primary"
            >
              {showAll
                ? "Show Less"
                : `Show ${selectedCurrencies.length - 6} More`}
            </Button>
          )}

          {/* Refresh & Info */}
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isLive ? (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Just now"}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                  <span>Using approximate rates</span>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRates}
              disabled={isLoading}
              className="text-xs h-7 gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CurrencyConverter;
