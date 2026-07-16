// 注水问题 · 实现
export interface WfHooks {
  onFill?: (i: number, level: number) => void;
  onConclude?: (levels: number[], minLevel: number) => void;
}
export function waterFilling(
  capacities: readonly number[],
  water: number,
  hooks: WfHooks = {},
): { levels: number[]; minLevel: number } {
  const order = capacities.map((c, i) => ({ c, i })).sort((a, b) => a.c - b.c);
  const levels = new Array<number>(capacities.length).fill(0);
  let remaining = water;
  for (let k = 0; k < order.length; k++) {
    const cnt = k + 1;
    const need = order[k]!.c - (levels[order[k]!.i] ?? 0);
    // 平均到前 cnt 个最小
    const prev = k === 0 ? 0 : order[k - 1]!.c;
    const fillTo = Math.min(order[k]!.c, prev + remaining / cnt);
    let used = 0;
    for (let j = 0; j <= k; j++) {
      const before = levels[order[j]!.i] ?? 0;
      const after = Math.min(capacities[order[j]!.i]!, fillTo);
      used += after - before;
      levels[order[j]!.i] = after;
      hooks.onFill?.(order[j]!.i, after);
    }
    remaining -= used;
    if (remaining <= 0) break;
    void need;
  }
  const minLevel = Math.min(...levels);
  hooks.onConclude?.(levels, minLevel);
  return { levels, minLevel };
}
