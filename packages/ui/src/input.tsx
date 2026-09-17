import * as React from "react";
import { cn } from "./utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props}, ref) => (
  <input ref={ref} className={cn("flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props}, ref) => (
  <textarea ref={ref} className={cn("flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]", className)} {...props} />
));
Textarea.displayName = "Textarea";
export function Label({ className, ...props}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-slate-700", className)} {...props} />;
}
