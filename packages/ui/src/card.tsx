import * as React from "react";
import { cn } from "./utils";
export function Card({ className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm", className)} {...props} />;
}
export function CardHeader({ className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 border-b border-slate-100 dark:border-slate-800", className)} {...props} />;
}
export function CardContent({ className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}
