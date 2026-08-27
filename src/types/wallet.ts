/**
 * Core wallet domain types.
 * These are shaped so real APIs (prices, balances, chain data) can be
 * connected later without changing the Dashboard components.
 */

export type AssetSymbol = string;

export interface WalletAsset {
  id: string;
  name: string;
  symbol: AssetSymbol;
  /** Amount held, in the asset's own units. */
  balance: number;
  /** Fiat value of the holding, in the display currency. */
  fiatValue: number;
  /** Price change over the last 24h, in percent. */
  changePercent24h: number;
  /** Brand color used for the coin badge. */
  color: string;
  /** Short glyph used until real coin artwork is wired up. */
  glyph: string;
}

export type TransactionType = "deposit" | "withdraw" | "send" | "receive" | "swap";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  symbol: AssetSymbol;
  amount: number;
  fiatValue: number;
  status: TransactionStatus;
  /** ISO 8601 timestamp. */
  createdAt: string;
}

export interface PortfolioSummary {
  currency: string;
  availableBalance: number;
  changePercentToday: number;
  changeValueToday: number;
}

export interface WalletSnapshot {
  portfolio: PortfolioSummary;
  assets: WalletAsset[];
  transactions: WalletTransaction[];
}
