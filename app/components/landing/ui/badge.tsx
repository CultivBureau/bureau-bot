import * as React from "react";

import { cn } from "./utils";

const badgeBase =
  "inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide";

const badgeVariants = {
  default: "bg-primary text-primary-foreground border-transparent",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  outline: "bg-transparent text-foreground border-border",
  accent: "bg-accent text-accent-foreground border-transparent",
} as const;

type BadgeVariant = keyof typeof badgeVariants;

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeBase, badgeVariants[variant], className)}
      {...props}
    />
  );
}

export { Badge };
