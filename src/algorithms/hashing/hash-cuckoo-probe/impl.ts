// 布谷鸟探查 · 实现
export interface CuckooHooks {
  onEvict?: (kickedKey: string, fromSlot: number, toSlot: number) => void;
  onInsert?: (key: string, slot: number) => void;
  onConclude?: (success: boolean, kicks: number) => void;
}
const SIZE = 16;
export function cuckooInsert(
  keys: readonly string[],
  h1: (k: string) => number,
  h2: (k: string) => number,
  hooks: CuckooHooks = {},
): boolean {
  const table = new Array<string | undefined>(SIZE);
  let kicks = 0;
  for (const key of keys) {
    let cur: string | undefined = key;
    let pos = h1(cur) % SIZE;
    for (let attempt = 0; attempt < 50 && cur !== undefined; attempt++) {
      if (table[pos] === undefined) {
        table[pos] = cur;
        hooks.onInsert?.(cur, pos);
        cur = undefined;
      } else {
        const kicked = table[pos]!;
        table[pos] = cur;
        hooks.onEvict?.(kicked, pos, h2(kicked) % SIZE);
        pos = pos === h1(kicked) % SIZE ? h2(kicked) % SIZE : h1(kicked) % SIZE;
        cur = kicked;
        kicks++;
      }
    }
    if (cur !== undefined) {
      hooks.onConclude?.(false, kicks);
      return false;
    }
  }
  hooks.onConclude?.(true, kicks);
  return true;
}
