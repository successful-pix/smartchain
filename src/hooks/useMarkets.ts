import { useQuery } from "@tanstack/react-query";
import { fetchMarketChart, fetchMarkets } from "@/services/marketApi";
import { SUPPORTED_ASSETS } from "@/data/assets";
import type { MarketAsset } from "@/types/wallet";

const REFRESH_MS = 60_000;
const fallbackMarkets: MarketAsset[] = SUPPORTED_ASSETS.map((asset) => ({
  id: asset.id,
  name: asset.name,
  symbol: asset.symbol,
  image: "",
  price: 0,
  changePercent24h: 0,
  marketCap: 0,
  volume24h: 0,
  sparkline: [],
}));

export function useMarkets() {
  const query = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      try {
        return await fetchMarkets();
      } catch {
        // Never let a provider outage make the wallet's supported-asset list
        // disappear. The rows remain visible and retry can restore live data.
        return fallbackMarkets;
      }
    },
    refetchInterval: REFRESH_MS,
    staleTime: 30_000,
    retry: 2,
    refetchOnWindowFocus: true,
  });
  const bySymbol = new Map<string, MarketAsset>();
  const byId = new Map<string, MarketAsset>();
  for (const m of query.data ?? []) { bySymbol.set(m.symbol, m); byId.set(m.id, m); }
  return { ...query, markets: query.data ?? fallbackMarkets, byId, bySymbol, lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null };
}

export function useMarketChart(id: string, days = 7) {
  return useQuery({ queryKey: ["market-chart", id, days], queryFn: () => fetchMarketChart(id, days), staleTime: 5 * 60_000, retry: 2, refetchOnWindowFocus: false });
}
