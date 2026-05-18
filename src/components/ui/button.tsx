import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
  {
    variants: {
      variant: {
        default: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm",
        whatsapp: "bg-whatsapp hover:bg-whatsapp-hover text-white shadow-sm",
        outline:
          "ring-1 ring-inset ring-slate-200 text-brand-600 hover:bg-brand-50/80 bg-white shadow-sm",
        outlineOnDark:
          "ring-1 ring-inset ring-white/25 text-white hover:bg-white/10 bg-transparent",
        portalOnDark:
          "bg-white text-brand-700 hover:bg-slate-50 shadow-md ring-1 ring-inset ring-white/40",
        ghost: "hover:bg-slate-100 text-slate-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        lg: "h-14 px-6 text-base",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
