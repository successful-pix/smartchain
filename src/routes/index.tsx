import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/wallet/AppHeader";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { QuickActions } from "@/components/wallet/QuickActions";
import { AssetList } from "@/components/wallet/AssetList";
import { RecentActivity } from "@/components/wallet/RecentActivity";
import { BottomNavigation } from "@/components/wallet/BottomNavigation";
import { useNotifications, usePortfolio, useTransactions } from "@/hooks/useWalletData";

const title = "SmartChain Wallet — Secure Crypto Dashboard";
const description = "SmartChain is a premium crypto wallet dashboard: track balances, assets and activity in one secure mobile-first interface.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] }),
  component: Dashboard,
});

function Dashboard() {
  const portfolio = usePortfolio();
  const transactions = useTransactions(5);
  const notifications = useNotifications();
  const error = portfolio.error ?? transactions.error;

  return <div className="min-h-screen bg-background pb-24">
    <AppHeader notificationCount={notifications.unread} />
    <main className="mx-auto max-w-lg space-y-6 px-4 pt-5">
      <h1 className="sr-only">SmartChain wallet dashboard</h1>
      <BalanceCard portfolio={portfolio.portfolio} loading={portfolio.loading} />
      <QuickActions />
      <AssetList positions={portfolio.positions} loading={portfolio.loading} error={error ? (error as Error).message : null} onRetry={() => { void portfolio.holdings.refetch(); void portfolio.markets.refetch(); void transactions.refetch(); }} />
      <RecentActivity transactions={transactions.data ?? []} loading={transactions.isLoading} />
    </main>
    <BottomNavigation active="home" />
  </div>;
}
