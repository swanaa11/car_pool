import { describe, it, expect } from "vitest";
import { computeMatchingScore } from "./matching";
import type { Ride } from "@carpull/types";

const baseRide: Ride = {
  id:"r1", driver_id:"d1", vehicle_id:null, type:"ONE_TIME", origin_label:"Berlin Hbf", origin_lat:52.52, origin_lng:13.40,
  destination_label:"Potsdam Hbf", destination_lat:52.39, destination_lng:13.06, pickup_label:null, dropoff_label:null,
  departure_at: new Date().toISOString(), arrival_at:null, seats_total:3, seats_available:3, contribution_cents:500,
  notes:null, smoking_allowed:false, pets_allowed:false, luggage_large:true, conversation_pref:"whatever",
  recurring_group_id:null, status:"SCHEDULED", created_at:new Date().toISOString(),
  driver:{ id:"d1", email:"a@a.de", first_name:"Anna", last_name:"M", avatar_url:null, city:"Berlin", bio:null, languages:["de"], phone:null, phone_verified:true, role:"USER", state:"ACTIVE", rating_avg:5, rating_count:10, completed_rides:10, verification_badges:[], created_at:"", updated_at:""} as any
};

describe("matching",()=>{
  it("scores high when route matches",()=>{
    const score = computeMatchingScore(baseRide, { from:"Berlin", to:"Potsdam", date: new Date().toISOString().slice(0,10) });
    expect(score).toBeGreaterThan(0.7);
  });
  it("scores lower when route mismatched",()=>{
    const matched = computeMatchingScore(baseRide, { from:"Berlin", to:"Potsdam", date: new Date().toISOString().slice(0,10) });
    const mismatched = computeMatchingScore(baseRide, { from:"München", to:"Stuttgart" });
    expect(mismatched).toBeLessThan(matched);
  });
  it("respects smoking preference",()=>{
    const rideSmoker = {...baseRide, smoking_allowed:true};
    const score = computeMatchingScore(rideSmoker, { from:"Berlin", to:"Potsdam" }, { smoking:false });
    const score2 = computeMatchingScore(baseRide, { from:"Berlin", to:"Potsdam" }, { smoking:false });
    expect(score2).toBeGreaterThan(score);
  });
});
