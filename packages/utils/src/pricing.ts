export function centsToEuro(cents:number): string {
  return (cents/100).toFixed(2).replace(".", ",") + " €";
}
export function euroToCents(euro:number): number {
  return Math.round(euro*100);
}
export function contributionPerKm(cents:number, km:number): string | null {
  if (!km) return null;
  return centsToEuro(Math.round(cents / km)) + "/km";
}
