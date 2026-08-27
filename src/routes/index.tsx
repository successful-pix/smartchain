import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/wallet/AppHeader";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { QuickActions } from "@/components/wallet/QuickActions";
import { AssetList } from "@/components/wallet/AssetList";
import { RecentActivity } from "@/components/wallet/RecentActivity";
import { BottomNavigation } from "@/components/wallet/BottomNavigation";
import { InstallPrompt } from "@/components/wallet/InstallPrompt";
import { useNotifications, usePortfolio, useTransactions } from "@/hooks/useWalletData";
const title="SmartChain Wallet — Secure Crypto Dashboard";const description="SmartChain is a secure crypto wallet and trading platform.";
export const Route=createFileRoute("/")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:image",content:"/og-image.svg"},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:image",content:"/og-image.svg"}]}),component:Dashboard});
function Dashboard(){const p=usePortfolio();const tx=useTransactions(5);const n=useNotifications();const error=p.error??tx.error;return <div className="min-h-screen bg-background pb-24"><AppHeader notificationCount={n.unread}/><main className="mx-auto max-w-lg space-y-6 px-4 pt-5"><h1 className="sr-only">SmartChain wallet dashboard</h1><BalanceCard portfolio={p.portfolio} loading={p.loading}/><QuickActions/><AssetList positions={p.positions} loading={p.loading} error={error?(error as Error).message:null} onRetry={()=>{void p.holdings.refetch();void p.markets.refetch();void tx.refetch();}} onSelect={position=>{window.location.href=`/asset/${position.market.id}`}} onViewAll={()=>{window.location.href="/markets"}}/><RecentActivity transactions={tx.data??[]} loading={tx.isLoading}/></main><InstallPrompt/><BottomNavigation active="home"/></div>}
