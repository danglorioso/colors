import type { OKLCH } from "../types";

/**
 * ΔE* (Euclidean distance in OKLab rectangular space).
 *
 * Converting OKLCH → OKLab before computing distance correctly treats hue as
 * an angle rather than a linear axis, fixing the wrap-around discontinuity
 * at 0°/360° and giving a true perceptual metric.
 */
export function oklchDistance(a: OKLCH, b: OKLCH): number {
  const hA = (a.h * Math.PI) / 180;
  const hB = (b.h * Math.PI) / 180;

  const dl = a.l - b.l;
  const da = a.c * Math.cos(hA) - b.c * Math.cos(hB);
  const db = a.c * Math.sin(hA) - b.c * Math.sin(hB);

  return Math.sqrt(dl * dl + da * da + db * db);
}
