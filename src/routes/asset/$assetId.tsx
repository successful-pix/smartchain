import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowDownToLine, Send } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMarkets, useMarketChart } from "@/hooks/useMarkets";
import { useHoldings } from "@/hooks/useWalletData";
import { formatFiat } from "@/lib/format";

export const Route = createFileRoute("/asset/$assetId")({ component: AssetDetails });

function AssetDetails() {
  const { assetId } = Route.useParams();
  const { markets, isLoading } = useMarkets();
  const { data: holdings = [] } = useHoldings();
  const { data: chart = [], isLoading: chartLoading } = useMarketChart(assetId, 7);
  const market = markets.find((asset) => asset.id === assetId);
  const balance = Number(holdings.find((holding) => holding.asset_id === assetId)?.balance ?? 0);

  if (isLoading) return <main className="mx-auto max-w-lg p-5">Loading asset…</main>;
  if (!market) return <main className="mx-auto max-w-lg p-5">Asset not found.</main>;

  const positive = market.changePercent24h >= 0;
  const chartData = chart.map((point) => ({ ...point, label: new Date(point.t).toLocaleDateString(undefined, { month: "short", day: "numeric" }) }));

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-5">
      <Link to="/markets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={17} /> Markets</Link>
      <section className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={market.image} alt="" className="size-12 rounded-full" />
          <div><h1 className="text-2xl font-semibold">{market.name}</h1><p className="text-sm text-muted-foreground">{market.symbol}/USD</p></div>
        </div>

        <div className="mt-7">
          <p className="text-4xl font-semibold tracking-tight">{formatFiat(market.price)}</p>
          <p className={`mt-1 text-base font-medium ${positive ? "text-success" : "text-destructive"}`}>{positive ? "▲" : "▼"} {Math.abs(market.changePercent24h).toFixed(2)}% today</p>
        </div>

        <div className="mt-6 h-56">
          {chartLoading ? <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading live chart…</div> : chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs><linearGradient id="assetFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity={0.28} /><stop offset="100%" stopColor="currentColor" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="label" hide /><YAxis domain={["dataMin", "dataMax"]} hide />
                <Tooltip formatter={(value) => formatFiat(Number(value))} labelFormatter={(label) => label} />
                <Area type="monotone" dataKey="price" stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth={2.5} fill="url(#assetFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="grid h-full place-items-center text-sm text-muted-foreground">Chart data is temporarily unavailable.</div>}
        </div>
        <p className="text-center text-xs text-muted-foreground">Live 7-day market chart • Powered by CoinGecko</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Your balance</p><p className="mt-1 text-lg font-semibold">{balance.toLocaleString()} {market.symbol}</p></div>
          <div className="rounded-2xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Your value</p><p className="mt-1 text-lg font-semibold">{formatFiat(balance * market.price)}</p></div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/receive" search={{}} className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold hover:bg-secondary/70"><ArrowDownToLine size={17} /> Receive</Link>
          <Link to="/send" search={{}} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"><Send size={17} /> Send</Link>
        </div>
      </section>
    </main>
  );
}
