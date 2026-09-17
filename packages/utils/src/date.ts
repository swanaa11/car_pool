export function toISODate(d: Date): string { return d.toISOString().slice(0,10); }
export function formatDateDe(iso:string, locale="de"): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale==="de" ? "de-DE" : "en-GB", { weekday:"short", day:"2-digit", month:"short", year:"numeric" }).format(d);
  } catch { return iso; }
}
export function formatTimeDe(iso:string): string {
  try { return new Intl.DateTimeFormat("de-DE", { hour:"2-digit", minute:"2-digit" }).format(new Date(iso)); } catch { return iso; }
}
export function isFuture(iso:string): boolean { return new Date(iso).getTime() > Date.now(); }
