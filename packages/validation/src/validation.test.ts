import { describe, it, expect } from "vitest";
import { rideCreateSchema } from "./index";
describe("validation",()=>{
  it("rejects empty origin",()=>{
    const r = rideCreateSchema.safeParse({ origin_label:"", destination_label:"Potsdam", departure_at: new Date().toISOString(), seats_total:3, contribution_cents:500 });
    expect(r.success).toBe(false);
  });
  it("accepts valid ride",()=>{
    const r = rideCreateSchema.safeParse({ origin_label:"Berlin", destination_label:"Potsdam", departure_at: new Date().toISOString(), seats_total:3, contribution_cents:500 });
    expect(r.success).toBe(true);
  });
});
