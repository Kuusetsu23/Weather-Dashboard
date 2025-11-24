import { describe, expect, it } from "vitest";
import { kelvinToCelsius } from "../src/utils/kelvinToCelsius.js";

describe("Temperature Conversion", () => {
  it("convert Kelvin to Celsius correctly", () => {
    expect(kelvinToCelsius(300)).toBe(27);
  });
});
