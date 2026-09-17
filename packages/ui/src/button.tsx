import * as React from "react";
import { cn } from "./utils";
type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";
export function Button({ variant="primary", size="md", className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  const variants: Record<Variant,string> = {
    primary: "bg-brand text-white hover:bg-brand-hover focus:ring-brand shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/25",
    secondary: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-brand",
    ghost: "bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-brand",
    accent: "bg-amber-400 text-asphalt hover:bg-amber-300 focus:ring-amber-500 shadow-sm shadow-amber-500/30 hover:shadow-md hover:shadow-amber-500/40",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };
  const sizes: Record<Size,string> = { sm: "h-9 px-3 text-sm", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
