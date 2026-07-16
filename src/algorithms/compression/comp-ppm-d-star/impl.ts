// PPM*d · 实现（简化：order-0/1/2 混合）
export interface PpmdHooks {
  onBlend?: (sym: number, prob: number) => void;
}
export function ppmStar(
  data: number[],
  hooks: PpmdHooks = {},
): Array<{ sym: number; prob: number }> {
  const o0 = new Map<number, number>();
  const o1 = new Map<number, Map<number, number>>();
  const o2 = new Map<string, Map<number, number>>();
  const out: Array<{ sym: number; prob: number }> = [];
  for (let i = 0; i < data.length; i++) {
    const sym = data[i]!;
    const p0 =
      (o0.get(sym) ?? 0) /
      Math.max(
        1,
        [...o0.values()].reduce((a, b) => a + b, 0),
      );
    let p1 = p0;
    if (i > 0) {
      const t = o1.get(data[i - 1]!);
      if (t) {
        const tot = [...t.values()].reduce((a, b) => a + b, 0);
        p1 = t.get(sym) ? t.get(sym)! / tot : p0;
      }
    }
    let p2 = p1;
    if (i > 1) {
      const t = o2.get(`${data[i - 2]!},${data[i - 1]!}`);
      if (t) {
        const tot = [...t.values()].reduce((a, b) => a + b, 0);
        p2 = t.get(sym) ? t.get(sym)! / tot : p1;
      }
    }
    const blended = 0.2 * p0 + 0.3 * p1 + 0.5 * p2;
    hooks.onBlend?.(sym, blended);
    out.push({ sym, prob: blended });
    o0.set(sym, (o0.get(sym) ?? 0) + 1);
    if (i > 0) {
      if (!o1.has(data[i - 1]!)) o1.set(data[i - 1]!, new Map());
      const t = o1.get(data[i - 1]!)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
    if (i > 1) {
      const k = `${data[i - 2]!},${data[i - 1]!}`;
      if (!o2.has(k)) o2.set(k, new Map());
      const t = o2.get(k)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
  }
  return out;
}
