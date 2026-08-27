import type { WalletAsset } from "@/types/wallet";
import { AssetRow } from "./AssetRow";

interface AssetListProps {
  assets: WalletAsset[];
  loading?: boolean;
  onViewAll?: () => void;
}

export function AssetList({ assets, loading = false, onViewAll }: AssetListProps) {
  return (
    <section aria-labelledby="assets-heading">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 id="assets-heading" className="font-display text-sm font-semibold">
          Assets
        </h2>
        <span className="text-xs text-muted-foreground">{assets.length} listed</span>
      </div>

      <div className="rounded-[12px] border border-border bg-card p-1">
        {loading ? (
          <ul className="space-y-1 p-2">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 py-2">
                <span className="size-9 animate-pulse rounded-full bg-border" />
                <span className="h-4 flex-1 animate-pulse rounded bg-border" />
                <span className="h-4 w-14 animate-pulse rounded bg-border" />
              </li>
            ))}
          </ul>
        ) : assets.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No assets in this wallet yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {assets.map((asset) => (
              <AssetRow key={asset.id} asset={asset} />
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="mt-3 w-full rounded-[10px] border border-primary/30 bg-primary/10 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        View All Assets
      </button>
    </section>
  );
}
