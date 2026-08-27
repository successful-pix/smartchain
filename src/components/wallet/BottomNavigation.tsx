import { CandlestickChart, Home, LineChart, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const tabs: NavTab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "markets", label: "Markets", icon: LineChart },
  { id: "trade", label: "Trade", icon: CandlestickChart },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "account", label: "Account", icon: User },
];

interface BottomNavigationProps {
  active?: string;
  onSelect?: (id: string) => void;
}

export function BottomNavigation({ active = "home", onSelect }: BottomNavigationProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-secondary/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect?.(id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
