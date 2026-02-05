import { supabase } from "@/integrations/supabase/client";

// Fallback exchange rates relative to INR (used when API fails)
export const fallbackRates: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  SGD: 0.016,
  AUD: 0.018,
  CAD: 0.016,
  JPY: 1.78,
  THB: 0.42,
  MYR: 0.053,
  RUB: 1.08,
  HKD: 0.093,
};

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

export const currencies: CurrencyInfo[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
];

export interface ExchangeRatesResponse {
  success: boolean;
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  error?: string;
}

// Fetch live exchange rates from edge function
export const fetchLiveExchangeRates = async (
  baseCurrency: string = "INR"
): Promise<ExchangeRatesResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke("exchange-rates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });

    // The edge function uses query params, so we need to call it differently
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exchange-rates?base=${baseCurrency}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching live rates:", error);
    return {
      success: false,
      base: baseCurrency,
      rates: {},
      lastUpdated: "",
      error: "Failed to fetch live rates",
    };
  }
};

// Convert amount from source currency to target currency using provided rates
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number => {
  // If rates are based on INR
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // If source is base (INR), just multiply by target rate
  // If source is not base, convert to base first, then to target
  if (fromCurrency === "INR") {
    return amount * toRate;
  } else if (toCurrency === "INR") {
    return amount / fromRate;
  } else {
    // Convert from source to INR, then to target
    const amountInBase = amount / fromRate;
    return amountInBase * toRate;
  }
};

// Format currency with appropriate decimal places
export const formatConvertedCurrency = (
  amount: number,
  currencyCode: string
): string => {
  const currency = currencies.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;

  // JPY and some currencies don't use decimals
  const decimals = ["JPY", "RUB", "THB", "INR"].includes(currencyCode) ? 0 : 2;

  return `${symbol}${amount.toFixed(decimals)}`;
};

// Get a subset of popular currencies for quick conversion display
export const getPopularCurrencies = (excludeCode?: string): CurrencyInfo[] => {
  const popular = ["USD", "EUR", "GBP", "AED", "SGD", "JPY"];
  return currencies.filter(
    (c) => popular.includes(c.code) && c.code !== excludeCode
  );
};
