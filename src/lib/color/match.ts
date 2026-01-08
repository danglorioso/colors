import { toOKLCH } from "./convert";
import { oklchDistance } from "./distance";
import { tailwindColors } from "./tailwind";
import type { MatchResult } from "../types";

export function findClosest(input: string, limit = 3): MatchResult[] {
// Convert input color to OKLCH
  const target = toOKLCH(input);

  // Compute distances to all Tailwind colors and sort by distance
  return Object.entries(tailwindColors)
    .map(([name, color]) => ({
      name,
      color,
      distance: oklchDistance(target, color),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
