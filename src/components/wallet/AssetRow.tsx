import type { WalletAsset } from "@/types/wallet";
import { formatFiat, formatPercent } from "@/data/mock-wallet";

interface AssetRowProps {
  asset: WalletAsset;
  onSelect?: (asset: WalletAsset) => void;
}

export function AssetRow({ asset, onSelect }: AssetRowProps) {
  const positive = asset.changePercent24h >= 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(asset)}
        aria-label={`${asset.name}, ${formatFiat(asset.fiatValue)}`}
        className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold"
          style={{ backgroundColor: `${asset.color}1f`, color: asset.color }}
        >
          {asset.glyph}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{asset.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {asset.symbol} · {formatFiat(asset.fiatValue)}
          </span>
        </span>

        <span className="text-right">
          <span className="block text-sm font-medium tabular-nums">
            {asset.balance.toFixed(asset.symbol === "USDT" ? 2 : 6)}
          </span>
          <span
            className={`block text-xs tabular-nums ${positive ? "text-success" : "text-destructive"}`}
          >
            {formatPercent(asset.changePercent24h)}
          </span>
        </span>
      </button>
    </li>
  );
}
