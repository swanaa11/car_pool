import { describe, it, expect } from "vitest";
import { centsToEuro } from "./pricing";
import { haversineKm } from "./geo";
describe("pricing",()=>{ it("formats cents",()=> expect(centsToEuro(500)).toBe("5,00 €")); });
describe("geo",()=>{ it("haversine",()=> expect(haversineKm(52.52,13.40,52.39,13.06)).toBeGreaterThan(10)); });
