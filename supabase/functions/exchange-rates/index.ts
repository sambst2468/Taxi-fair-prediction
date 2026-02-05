import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Free exchange rate API (no API key required)
const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const baseCurrency = url.searchParams.get('base') || 'INR';
    
    // Fetch live exchange rates
    const response = await fetch(`${EXCHANGE_API_URL}/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Exchange API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result !== 'success') {
      throw new Error('Failed to fetch exchange rates');
    }
    
    // Return relevant rates
    const supportedCurrencies = [
      'INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 
      'AUD', 'CAD', 'JPY', 'THB', 'MYR', 'RUB', 'HKD'
    ];
    
    const filteredRates: Record<string, number> = {};
    for (const currency of supportedCurrencies) {
      if (data.rates[currency]) {
        filteredRates[currency] = data.rates[currency];
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        base: data.base_code,
        rates: filteredRates,
        lastUpdated: data.time_last_update_utc,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
    console.error('Error fetching exchange rates:', errorMessage);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
