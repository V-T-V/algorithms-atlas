export interface D2Hooks {
  onEmit?: (i: number, d2: number) => void;
}
export function delta2Encode(
  values: number[],
  hooks: D2Hooks = {},
): { d1: number[]; d2: number[] } {
  const d1 = values.map((v, i) => (i === 0 ? v : v - values[i - 1]!));
  const d2 = d1.map((v, i) => (i === 0 ? v : v - d1[i - 1]!));
  d2.forEach((v, i) => hooks.onEmit?.(i, v));
  return { d1, d2 };
}
