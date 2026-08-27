import { Bell, Menu, ShieldCheck } from "lucide-react";

interface AppHeaderProps {
  notificationCount?: number;
  onMenuClick?: () => void;
}

export function AppHeader({ notificationCount = 0, onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="-ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Menu size={20} />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-[image:var(--gradient-gold)] text-[13px] font-bold text-primary-foreground"
            style={{ boxShadow: "var(--shadow-gold)" }}
          >
            S
          </span>
          <span className="truncate font-display text-[15px] font-semibold tracking-tight">
            SmartChain
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Security center"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ShieldCheck size={19} />
          </button>

          <button
            type="button"
            aria-label={
              notificationCount > 0
                ? `Notifications, ${notificationCount} unread`
                : "Notifications"
            }
            className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Bell size={19} />
            {notificationCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Account"
            className="ml-1 grid size-8 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            SC
          </button>
        </div>
      </div>
    </header>
  );
}
