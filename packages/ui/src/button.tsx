import * as React from "react";
import { cn } from "./utils";
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";
export function Button({ variant="primary", size="md", className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<Variant,string> = {
    primary: "bg-[#0F766E] text-white hover:bg-[#0D5C56] focus:ring-[#0F766E] shadow-sm",
    secondary: "bg-white text-[#0F172A] border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes: Record<Size,string> = { sm: "h-9 px-3 text-sm", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
