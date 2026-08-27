import { useQuery } from "@tanstack/react-query";
import { fetchMarketChart, fetchMarkets } from "@/services/marketApi";
import type { MarketAsset } from "@/types/wallet";

const REFRESH_MS = 60_000;

export function useMarkets() {
  const query = useQuery({
    queryKey: ["markets"],
    queryFn: () => fetchMarkets(),
    refetchInterval: REFRESH_MS,
    staleTime: REFRESH_MS / 2,
    retry: 1,
  });

  const bySymbol = new Map<string, MarketAsset>();
  const byId = new Map<string, MarketAsset>();
  for (const m of query.data ?? []) {
    bySymbol.set(m.symbol, m);
    byId.set(m.id, m);
  }

  return {
    ...query,
    markets: query.data ?? [],
    byId,
    bySymbol,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}

export function useMarketChart(id: string, days = 7) {
  return useQuery({
    queryKey: ["market-chart", id, days],
    queryFn: () => fetchMarketChart(id, days),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
