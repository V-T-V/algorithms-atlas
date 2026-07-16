// 算术编码 v3 · 实现（定点）
export interface AcHooks {
  onStep?: (sym: number, low: number, high: number) => void;
  onResult?: (low: number, high: number) => void;
}
export function arithmeticEncode(
  data: number[],
  freq: Map<number, [number, number]>,
  hooks: AcHooks = {},
): { low: number; high: number } {
  // freq: sym → [cumLow, cumHigh] in [0, total)
  let low = 0;
  let high = 65535;
  const total = 65536;
  for (const sym of data) {
    const range = high - low + 1;
    const [cl, ch] = freq.get(sym) ?? [0, 1];
    high = low + Math.floor((range * ch) / total) - 1;
    low = low + Math.floor((range * cl) / total);
    hooks.onStep?.(sym, low, high);
  }
  hooks.onResult?.(low, high);
  return { low, high };
}
