import { ArrowDownToLine, ArrowUpFromLine, Repeat, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

const actions: QuickAction[] = [
  { id: "deposit", label: "Deposit", icon: ArrowDownToLine },
  { id: "withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { id: "send", label: "Send", icon: Send },
  { id: "swap", label: "Swap", icon: Repeat },
];

interface QuickActionsProps {
  onAction?: (id: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <nav aria-label="Quick actions">
      <ul className="grid grid-cols-4 gap-2 sm:gap-3">
        {actions.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onAction?.(id)}
              className="group flex w-full flex-col items-center gap-2 rounded-[12px] border border-border bg-card px-1 py-3 transition-colors hover:border-primary/50 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={17} />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground sm:text-xs">
                {label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
