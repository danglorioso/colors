import type { OKLCH } from "../types";

/**
 * Perceptual distance in OKLCH space
 */
export function oklchDistance(a: OKLCH, b: OKLCH): number {
  const dl = a.l - b.l;
  const dc = a.c - b.c;
  const dh = a.h - b.h;

  return Math.sqrt(dl * dl + dc * dc + dh * dh);
}
