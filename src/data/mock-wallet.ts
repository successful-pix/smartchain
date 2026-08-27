import type { WalletSnapshot } from "@/types/wallet";

/**
 * Mock wallet data. Balances are intentionally zero — no simulated funds.
 * Replace this module with a real data source later.
 */
export const mockWallet: WalletSnapshot = {
  portfolio: {
    currency: "USD",
    availableBalance: 0,
    changePercentToday: 0,
    changeValueToday: 0,
  },
  assets: [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      balance: 0,
      fiatValue: 0,
      changePercent24h: 0,
      color: "#F7931A",
      glyph: "₿",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      balance: 0,
      fiatValue: 0,
      changePercent24h: 0,
      color: "#627EEA",
      glyph: "Ξ",
    },
    {
      id: "tether",
      name: "Tether",
      symbol: "USDT",
      balance: 0,
      fiatValue: 0,
      changePercent24h: 0,
      color: "#26A17B",
      glyph: "₮",
    },
  ],
  transactions: [],
};

export function formatFiat(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "+";
  return `${sign}${value.toFixed(2)}%`;
}
