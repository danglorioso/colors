export type OKLCH = {
  l: number;
  c: number;
  h: number;
};

export type MatchResult = {
  name: string;
  color: OKLCH;
  distance: number;
};
