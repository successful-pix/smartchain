import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { PortfolioSummary } from "@/types/wallet";
import { formatFiat, formatPercent } from "@/lib/format";

interface BalanceCardProps {
  portfolio: PortfolioSummary;
  loading?: boolean;
}

export function BalanceCard({ portfolio, loading = false }: BalanceCardProps) {
  const [hidden, setHidden] = useState(false);
  const positive = portfolio.changePercentToday >= 0;

  return (
    <section
      aria-label="Available balance"
      className="bank-card relative isolate overflow-hidden rounded-[12px] border border-border px-5 py-6 sm:px-6"
    >
      {/* faint abstract crypto pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 88% 12%, var(--color-primary) 0%, transparent 42%), repeating-linear-gradient(115deg, transparent 0 22px, var(--color-primary) 22px 23px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 -z-10 size-40 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--gradient-gold)" }}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Available Balance
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-44 animate-pulse rounded-md bg-border" />
          ) : (
            <p className="mt-2 font-display text-[34px] font-semibold leading-none tracking-tight sm:text-[40px]">
              {hidden ? "••••••" : formatFiat(portfolio.availableBalance, portfolio.currency)}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHidden((v) => !v)}
              aria-label={hidden ? "Show balance" : "Hide balance"}
              aria-pressed={hidden}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                positive
                  ? "border-success/25 bg-success/10 text-success"
                  : "border-destructive/25 bg-destructive/10 text-destructive"
              }`}
            >
              {formatPercent(portfolio.changePercentToday)} Today
            </span>
          </div>
        </div>

        <span className="rounded-[6px] border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
          {portfolio.currency}
        </span>
      </div>

      <div className="mt-7 flex items-end justify-between">
        <span className="font-display text-[13px] tracking-[0.32em] text-muted-foreground">
          •••• •••• •••• 0000
        </span>
        <span className="font-display text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          SmartChain
        </span>
      </div>
    </section>
  );
}
