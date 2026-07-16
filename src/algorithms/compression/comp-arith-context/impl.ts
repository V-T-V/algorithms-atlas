export interface CaacHooks {
  onSymbol?: (ctx: number, bit: number, p0: number) => void;
}
export function caacEncode(
  bits: number[],
  ctxBits: number,
  hooks: CaacHooks = {},
): { low: number; range: number; tables: Map<number, [number, number]> } {
  const tables = new Map<number, [number, number]>();
  let low = 0;
  let range = 1;
  let history = 0;
  const mask = (1 << ctxBits) - 1;
  for (const b of bits) {
    const ctx = history & mask;
    const [c0, c1] = tables.get(ctx) ?? [1, 1];
    const p0 = c0 / (c0 + c1);
    range /= 2;
    const split = low + range * p0;
    if (b === 1) {
      low = split;
      tables.set(ctx, [c0, c1 + 1]);
    } else {
      tables.set(ctx, [c0 + 1, c1]);
    }
    hooks.onSymbol?.(ctx, b, p0);
    history = ((history << 1) | b) & ((1 << (ctxBits + 4)) - 1);
  }
  return { low, range, tables };
}
