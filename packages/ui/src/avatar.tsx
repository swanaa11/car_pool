import { cn } from "./utils";
export function Avatar({ src, name, size=40 }: { src?: string|null; name: string; size?: number }) {
  const initials = name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase() || "?";
  return (
    <div style={{width:size, height:size}} className={cn("rounded-full bg-teal-700 text-white flex items-center justify-center font-semibold shrink-0 overflow-hidden")}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span style={{fontSize: size*0.4}}>{initials}</span>}
    </div>
  );
}
