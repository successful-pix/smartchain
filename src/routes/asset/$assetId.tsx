import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowDownToLine, Send, Loader2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMarkets, useMarketChart } from "@/hooks/useMarkets";
import { useHoldings, useCreateTransaction } from "@/hooks/useWalletData";
import { formatFiat } from "@/lib/format";

export const Route = createFileRoute("/asset/$assetId")({ component: AssetDetails });

function AssetDetails() {
  const { assetId } = Route.useParams();
  const { markets, isLoading } = useMarkets();
  const { data: holdings = [] } = useHoldings();
  const { data: chart = [], isLoading: chartLoading } = useMarketChart(assetId, 7);
  const createTrade = useCreateTransaction();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const market = markets.find((asset) => asset.id === assetId);
  const balance = Number(holdings.find((holding) => holding.asset_id === assetId)?.balance ?? 0);

  if (isLoading) return <main className="mx-auto max-w-lg p-5">Loading asset…</main>;
  if (!market) return <main className="mx-auto max-w-lg p-5">Asset not found.</main>;

  const positive = market.changePercent24h >= 0;
  const chartData = chart.map((point) => ({ ...point, label: new Date(point.t).toLocaleDateString(undefined, { month: "short", day: "numeric" }) }));
  const fiatValue = Number(amount || 0) * market.price;

  async function submitTrade() {
    const quantity = Number(amount);
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    try {
      const reference = await createTrade.mutateAsync({
        type: "swap",
        asset_id: market.id,
        symbol: market.symbol,
        amount: quantity,
        fiat_value: quantity * market.price,
        network: "Market",
        note: `${side.toUpperCase()} ${market.symbol}`,
      });
      setAmount("");
      toast.success(`${side === "buy" ? "Buy" : "Sell"} request created`, { description: `Reference: ${reference}` });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create trade request");
    }
  }

  return <main className="mx-auto max-w-lg px-4 pb-28 pt-5">
    <Link to="/trade" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={17} /> Choose another coin</Link>
    <section className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3"><img src={market.image} alt="" className="size-12 rounded-full" /><div><h1 className="text-2xl font-semibold">{market.name}</h1><p className="text-sm text-muted-foreground">{market.symbol}/USD</p></div></div>
      <div className="mt-7"><p className="text-4xl font-semibold tracking-tight">{formatFiat(market.price)}</p><p className={`mt-1 text-base font-medium ${positive ? "text-success" : "text-destructive"}`}>{positive ? "▲" : "▼"} {Math.abs(market.changePercent24h).toFixed(2)}% today</p></div>
      <div className="mt-6 h-56">{chartLoading ? <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading live chart…</div> : chartData.length > 1 ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}><XAxis dataKey="label" hide /><YAxis domain={["dataMin", "dataMax"]} hide /><Tooltip formatter={(value) => formatFiat(Number(value))} /><Area type="monotone" dataKey="price" stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth={2.5} fill="transparent" /></AreaChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Chart data is temporarily unavailable.</div>}</div>
      <p className="text-center text-xs text-muted-foreground">Live 7-day market chart • Powered by CoinGecko</p>
      <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Your balance</p><p className="mt-1 text-lg font-semibold">{balance.toLocaleString()} {market.symbol}</p></div><div className="rounded-2xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Your value</p><p className="mt-1 text-lg font-semibold">{formatFiat(balance * market.price)}</p></div></div>

      <div className="mt-6 rounded-2xl border border-border p-4"><div className="flex items-center gap-2"><TrendingUp size={18} className="text-primary" /><h2 className="font-semibold">Trade {market.symbol}</h2></div><div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1"><button type="button" onClick={() => setSide("buy")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${side === "buy" ? "bg-background shadow-sm text-success" : "text-muted-foreground"}`}>Buy</button><button type="button" onClick={() => setSide("sell")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${side === "sell" ? "bg-background shadow-sm text-destructive" : "text-muted-foreground"}`}>Sell</button></div><label className="mt-4 block text-sm font-medium">Amount<input min="0" step="any" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3" placeholder={`0.00 ${market.symbol}`} /></label><p className="mt-1 text-xs text-muted-foreground">Estimated value: {formatFiat(fiatValue)}</p><button type="button" disabled={createTrade.isPending || Number(amount) <= 0} onClick={() => void submitTrade()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">{createTrade.isPending && <Loader2 className="animate-spin" size={17} />}{createTrade.isPending ? "Submitting…" : `${side === "buy" ? "Buy" : "Sell"} ${market.symbol}`}</button></div>

      <div className="mt-5 grid grid-cols-2 gap-3"><Link to="/receive" className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold hover:bg-secondary/70"><ArrowDownToLine size={17} /> Receive</Link><Link to="/send" className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"><Send size={17} /> Send</Link></div>
    </section>
  </main>;
}
