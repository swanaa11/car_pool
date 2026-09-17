export const brand = {
  name: "Car Pool",
  tagline: "Gemeinsam fahren. Günstig. Nachhaltig.",
  taglineEn: "Ride together. Affordable. Sustainable.",
  colors: {
    primary: "#0F766E", // teal-700
    primaryHover: "#0D5C56",
    accent: "#F59E0B", // amber-500
    background: "#F8FAFC",
    text: "#0F172A",
    muted: "#64748B",
  },
  supportEmail: "support@carpool.de",
  url: "https://carpool.de",
} as const;

export const appConfig = {
  defaultLocale: "de" as const,
  locales: ["de", "en"] as const,
  maxSeats: 8,
  minContribution: 0,
  maxContribution: 99,
  rideSearchLimit: 20,
  messagePageSize: 50,
  bookingStates: ["REQUESTED","ACCEPTED","REJECTED","CANCELLED_BY_PASSENGER","CANCELLED_BY_DRIVER","COMPLETED","NO_SHOW"] as const,
  userStates: ["ACTIVE","SUSPENDED","BANNED","DELETED"] as const,
  roles: ["USER","MODERATOR","ADMIN"] as const,
  germanCities: ["Berlin","Hamburg","München","Köln","Frankfurt","Stuttgart","Düsseldorf","Leipzig","Dortmund","Essen","Bremen","Dresden","Hannover","Nürnberg","Duisburg","Bochum","Wuppertal","Bielefeld","Bonn","Münster","Karlsruhe","Mannheim","Augsburg","Wiesbaden","Gelsenkirchen","Mönchengladbach","Braunschweig","Chemnitz","Kiel","Aachen","Halle","Magdeburg","Freiburg","Krefeld","Lübeck","Oberhausen","Erfurt","Mainz","Rostock","Kassel","Hagen","Potsdam","Saarbrücken","Hamm","Mülheim","Ludwigshafen","Leverkusen","Oldenburg","Osnabrück"],
} as const;

export type Locale = (typeof appConfig.locales)[number];
