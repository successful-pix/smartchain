import type { MarketAsset } from "@/types/wallet";
import { SUPPORTED_ASSET_IDS } from "@/data/assets";

/**
 * Market-data provider adapter (CoinGecko public API).
 * All provider specifics live here so the provider can be swapped later
 * without touching hooks or UI.
 */
const BASE_URL = "https://api.coingecko.com/api/v3";

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  total_volume: number | null;
  sparkline_in_7d?: { price: number[] };
}

export class MarketDataError extends Error {}

async function request<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { headers: { accept: "application/json" } });
  } catch {
    throw new MarketDataError("Unable to reach the market data service.");
  }
  if (res.status === 429) {
    throw new MarketDataError("Market data is rate limited. Retrying shortly.");
  }
  if (!res.ok) {
    throw new MarketDataError(`Market data unavailable (${res.status}).`);
  }
  return (await res.json()) as T;
}

export async function fetchMarkets(ids = SUPPORTED_ASSET_IDS): Promise<MarketAsset[]> {
  const data = await request<CoinGeckoMarket[]>(
    `/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`,
  );
  return data.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    image: coin.image,
    price: coin.current_price ?? 0,
    changePercent24h: coin.price_change_percentage_24h ?? 0,
    marketCap: coin.market_cap ?? 0,
    volume24h: coin.total_volume ?? 0,
    sparkline: coin.sparkline_in_7d?.price ?? [],
  }));
}

export interface ChartPoint {
  t: number;
  price: number;
}

export async function fetchMarketChart(id: string, days = 7): Promise<ChartPoint[]> {
  const data = await request<{ prices: [number, number][] }>(
    `/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}`,
  );
  return data.prices.map(([t, price]) => ({ t, price }));
}
