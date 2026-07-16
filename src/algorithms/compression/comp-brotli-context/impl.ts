export interface BcHooks {
  onByte?: (ctx: number, byte: number) => void;
}
export function brotliContextModel(
  data: number[],
  hooks: BcHooks = {},
): Map<number, Map<number, number>> {
  const tables = new Map<number, Map<number, number>>();
  let p1 = 0;
  let p2 = 0;
  for (const b of data) {
    const ctx = ((p2 << 8) | p1) & 0xffff;
    const t = tables.get(ctx) ?? new Map<number, number>();
    t.set(b, (t.get(b) ?? 0) + 1);
    tables.set(ctx, t);
    hooks.onByte?.(ctx, b);
    p2 = p1;
    p1 = b;
  }
  return tables;
}
