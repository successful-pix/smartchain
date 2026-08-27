import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import type { AssetPosition } from "@/types/wallet";
import { AssetRow } from "./AssetRow";
import { EmptyState, ErrorState, LoadingState } from "./StateViews";

interface AssetListProps {
  positions: AssetPosition[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  showViewAll?: boolean;
  showHolding?: boolean;
  title?: string;
}

export function AssetList({
  positions,
  loading = false,
  error = null,
  onRetry,
  showViewAll = false,
  showHolding = true,
  title = "Assets",
}: AssetListProps) {
  return (
    <section aria-labelledby="assets-heading">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 id="assets-heading" className="font-display text-sm font-semibold">
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">{positions.length} listed</span>
      </div>

      <div className="rounded-[12px] border border-border bg-card p-1">
        {loading ? (
          <div className="p-2">
            <LoadingState label="Loading assets" />
          </div>
        ) : error ? (
          <div className="p-2">
            <ErrorState message={error} {...(onRetry ? { onRetry } : {})} />
          </div>
        ) : positions.length === 0 ? (
          <EmptyState icon={<Coins size={20} />} title="No assets to show" />
        ) : (
          <ul className="divide-y divide-border/60">
            {positions.map((position) => (
              <AssetRow key={position.market.id} position={position} showHolding={showHolding} />
            ))}
          </ul>
        )}
      </div>

      {showViewAll && (
        <Link
          to="/wallet"
          className="mt-3 block w-full rounded-[10px] border border-primary/30 bg-primary/10 py-2.5 text-center text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          View All Assets
        </Link>
      )}
    </section>
  );
}
