// PPM v2 · 实现（简化：order-1）
export interface PpmHooks {
  onPredict?: (ctx: number, sym: number, prob: number) => void;
  onEscape?: (ctx: number, order: number) => void;
}
export function ppmPredict(
  data: number[],
  maxOrder = 2,
  hooks: PpmHooks = {},
): Array<{ sym: number; ctx: number[]; escaped: boolean }> {
  // 上下文表：order-1 与 order-2
  const order1 = new Map<number, Map<number, number>>();
  const order2 = new Map<string, Map<number, number>>();
  const out: Array<{ sym: number; ctx: number[]; escaped: boolean }> = [];
  for (let i = 0; i < data.length; i++) {
    const sym = data[i]!;
    const ctx1 = i > 0 ? data[i - 1]! : -1;
    const key2 = i > 1 ? `${data[i - 2]!},${data[i - 1]!}` : '';
    let escaped = false;
    if (ctx1 >= 0) {
      const t1 = order1.get(ctx1);
      if (t1 && t1.has(sym)) {
        const total = [...t1.values()].reduce((a, b) => a + b, 0);
        hooks.onPredict?.(ctx1, sym, t1.get(sym)! / total);
      } else {
        escaped = true;
        hooks.onEscape?.(ctx1, 1);
      }
    }
    if (key2 && !escaped) {
      const t2 = order2.get(key2);
      if (t2 && t2.has(sym)) {
        const total = [...t2.values()].reduce((a, b) => a + b, 0);
        hooks.onPredict?.(ctx1, sym, t2.get(sym)! / total);
      }
    }
    // 更新表
    if (ctx1 >= 0) {
      if (!order1.has(ctx1)) order1.set(ctx1, new Map());
      const t = order1.get(ctx1)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
    if (key2) {
      if (!order2.has(key2)) order2.set(key2, new Map());
      const t = order2.get(key2)!;
      t.set(sym, (t.get(sym) ?? 0) + 1);
    }
    out.push({ sym, ctx: ctx1 >= 0 ? [ctx1] : [], escaped });
  }
  void maxOrder;
  return out;
}
