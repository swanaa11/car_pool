// Provider abstraction — keeps API keys server-side.
// For MVP we use a no-op (free) implementation; swap to Mapbox/Google by implementing these interfaces.

export interface GeocodeResult { label: string; lat: number; lng: number; }
export interface RouteResult { distanceKm: number; durationMin: number; geometry?: any; }

export interface GeocodingProvider {
  geocode(query: string): Promise<GeocodeResult[]>;
  reverse(lat:number,lng:number): Promise<string>;
}
export interface RoutingProvider {
  route(from:{lat:number,lng:number}, to:{lat:number,lng:number}): Promise<RouteResult>;
}

// Free OSM Nominatim implementation (server-side only, respects usage policy)
export class OsmGeocodingProvider implements GeocodingProvider {
  async geocode(query: string): Promise<GeocodeResult[]> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=de&limit=5`, {
        headers: { "User-Agent": "Car Pool/1.0 (contact@carpool.de)" },
        next: { revalidate: 3600 },
      });
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((r:any)=>({ label: r.display_name, lat: parseFloat(r.lat), lng: parseFloat(r.lon) }));
    } catch { return []; }
  }
  async reverse(lat:number,lng:number): Promise<string> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { "User-Agent": "Car Pool/1.0 (contact@carpool.de)" },
      });
      const data = await res.json();
      return data?.display_name ?? `${lat},${lng}`;
    } catch { return `${lat},${lng}`; }
  }
}

export class HaversineRoutingProvider implements RoutingProvider {
  async route(from:{lat:number,lng:number}, to:{lat:number,lng:number}): Promise<RouteResult> {
    const R=6371;
    const dLat=(to.lat-from.lat)*Math.PI/180, dLon=(to.lng-from.lng)*Math.PI/180;
    const a=Math.sin(dLat/2)**2+Math.cos(from.lat*Math.PI/180)*Math.cos(to.lat*Math.PI/180)*Math.sin(dLon/2)**2;
    const d=R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return { distanceKm: Math.round(d*10)/10, durationMin: Math.round(d/75*60) };
  }
}

export const geocodingProvider: GeocodingProvider = new OsmGeocodingProvider();
export const routingProvider: RoutingProvider = new HaversineRoutingProvider();
