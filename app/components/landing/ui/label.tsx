"use client";

import * as React from "react";

import { cn } from "./utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
