import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/wallet/AppHeader";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { QuickActions } from "@/components/wallet/QuickActions";
import { AssetList } from "@/components/wallet/AssetList";
import { RecentActivity } from "@/components/wallet/RecentActivity";
import { BottomNavigation } from "@/components/wallet/BottomNavigation";
import { useMarkets } from "@/hooks/useMarkets";
import type { AssetPosition, PortfolioSummary } from "@/types/wallet";

const title = "SmartChain Wallet — Secure Crypto Dashboard";
const description =
  "SmartChain is a premium crypto wallet dashboard: track balances, assets and activity in one secure mobile-first interface.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

const emptyPortfolio: PortfolioSummary = {
  currency: "USD",
  availableBalance: 0,
  changePercentToday: 0,
  changeValueToday: 0,
};

function Dashboard() {
  const { markets, isLoading, error, refetch } = useMarkets();

  // No signed-in wallet yet, so every position starts at a zero balance.
  const positions: AssetPosition[] = markets.map((market) => ({
    market,
    balance: 0,
    fiatValue: 0,
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader notificationCount={0} />

      <main className="mx-auto max-w-lg space-y-6 px-4 pt-5">
        <h1 className="sr-only">SmartChain wallet dashboard</h1>
        <BalanceCard portfolio={emptyPortfolio} loading={isLoading} />
        <QuickActions />
        <AssetList
          positions={positions}
          loading={isLoading}
          error={error ? (error as Error).message : null}
          onRetry={() => void refetch()}
        />
        <RecentActivity transactions={[]} />
      </main>

      <BottomNavigation active="home" />
    </div>
  );
}
