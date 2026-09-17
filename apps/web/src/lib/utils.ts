import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...i:(string|undefined|null|false)[]){return twMerge(clsx(i));}
export function centsToEuro(cents:number){return (cents/100).toFixed(2).replace(".",",")+" €";}
