export type OKLCH = {
  l: number; // 0–1
  c: number; // 0+
  h: number; // 0–360
};

export type MatchResult = {
  name: string;
  color: OKLCH;
  distance: number;
};
