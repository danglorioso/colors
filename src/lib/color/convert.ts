import { parse, oklch } from "culori";
import type { OKLCH } from "../types";

/**
 * Converts ANY CSS color (hex, rgb, hsl, lab, etc)
 * into OKLCH using culori.
 */
export function toOKLCH(input: string): OKLCH {
  const parsed = parse(input);
  if (!parsed) {
    throw new Error("Invalid color format");
  }

  const c = oklch(parsed);
  if (!c) {
    throw new Error("Cannot convert to OKLCH");
  }

  return {
    l: c.l,
    c: c.c,
    h: c.h ?? 0 // Grayscale colors have no hue
  };
}

/**
 * Converts ANY CSS color (hex, rgb, hsl, lab, etc)
 * into OKLCH string using culori.
 */
export function toOKLCHString(input: string): string {
  const parsed = parse(input);
  if (!parsed) {
    throw new Error("Invalid color format");
  }

  const c = oklch(parsed);
  if (!c) {
    throw new Error("Cannot convert to OKLCH");
  }

  return `oklch(${c.l * 100}% ${c.c} ${c.h ?? 0})`;
}