// Robin Hood 探查 · 实现
export interface RhEntry {
  key: number;
  psl: number;
}
export interface RhHooks {
  onSwap?: (richerKey: number, poorerKey: number) => void;
  onInsert?: (key: number, psl: number) => void;
  onConclude?: (maxPsl: number) => void;
}
export function robinHoodInsert(
  size: number,
  keys: readonly number[],
  hooks: RhHooks = {},
): number {
  const table = new Array<RhEntry | undefined>(size);
  let maxPsl = 0;
  for (const key of keys) {
    let cur: RhEntry = { key, psl: 0 };
    let idx = key % size;
    for (;;) {
      if (table[idx] === undefined) {
        table[idx] = cur;
        hooks.onInsert?.(cur.key, cur.psl);
        maxPsl = Math.max(maxPsl, cur.psl);
        break;
      }
      if (table[idx]!.psl < cur.psl) {
        const tmp = table[idx]!;
        table[idx] = cur;
        cur = tmp;
        hooks.onSwap?.(table[idx]!.key, cur.key);
      }
      idx = (idx + 1) % size;
      cur.psl++;
    }
  }
  hooks.onConclude?.(maxPsl);
  return maxPsl;
}
