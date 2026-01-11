import { describe, it, expect } from "vitest";
import { getTimestamp } from "./export";

describe("getTimestamp", () => {
  it("should return date in YYYY-MM-DD format", () => {
    const timestamp = getTimestamp();
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should return today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(getTimestamp()).toBe(today);
  });

  it("should return valid ISO date string prefix", () => {
    const timestamp = getTimestamp();
    const date = new Date(timestamp);
    expect(date.toString()).not.toBe("Invalid Date");
  });

  it("should have correct length", () => {
    const timestamp = getTimestamp();
    expect(timestamp.length).toBe(10); // YYYY-MM-DD
  });

  it("should have dashes at correct positions", () => {
    const timestamp = getTimestamp();
    expect(timestamp[4]).toBe("-");
    expect(timestamp[7]).toBe("-");
  });
});
