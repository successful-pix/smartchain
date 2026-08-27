import { Link } from "@tanstack/react-router";
import { CandlestickChart, Home, LineChart, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavTab {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const tabs: NavTab[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/swap", label: "Trade", icon: CandlestickChart },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/account", label: "Account", icon: User },
];

export function BottomNavigation() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-secondary/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: !!exact }}
              activeProps={{ className: "text-primary", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            >
              <Icon size={19} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
