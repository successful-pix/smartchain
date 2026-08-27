import { Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpFromLine, Repeat, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  search?: Record<string, string>;
}

const actions: QuickAction[] = [
  { id: "deposit", label: "Deposit", icon: ArrowDownToLine, to: "/receive" },
  { id: "withdraw", label: "Withdraw", icon: ArrowUpFromLine, to: "/send", search: { mode: "withdraw" } },
  { id: "send", label: "Send", icon: Send, to: "/send", search: { mode: "send" } },
  { id: "swap", label: "Swap", icon: Repeat, to: "/swap" },
];

export function QuickActions() {
  return (
    <nav aria-label="Quick actions">
      <ul className="grid grid-cols-4 gap-2 sm:gap-3">
        {actions.map(({ id, label, icon: Icon, to, search }) => (
          <li key={id}>
            <Link
              to={to}
              search={search ?? {}}
              className="group flex w-full flex-col items-center gap-2 rounded-[12px] border border-border bg-card px-1 py-3 transition-colors hover:border-primary/50 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={17} />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground sm:text-xs">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
