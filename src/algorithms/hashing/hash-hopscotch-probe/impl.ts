// Hopscotch 哈希 · 实现 (H=4)
export interface HhHooks {
  onDisplace?: (key: number, from: number, to: number) => void;
  onInsert?: (key: number, slot: number) => void;
  onConclude?: (success: boolean) => void;
}
const H = 4;
export function hopscotchInsert(
  size: number,
  keys: readonly number[],
  hooks: HhHooks = {},
): boolean {
  const table = new Array<number | undefined>(size);
  const bitmap = new Array<number>(size).fill(0);
  for (const key of keys) {
    const home = key % size;
    let idx = home;
    while (idx < size && table[idx] !== undefined) idx++;
    if (idx >= size || idx - home >= H * 4) {
      hooks.onConclude?.(false);
      return false;
    }
    while (idx - home >= H) {
      let moved = false;
      for (let j = Math.max(home, idx - H + 1); j <= idx - 1; j++) {
        const k = table[j]!;
        const kh = k % size;
        if (idx - kh < H) {
          table[idx] = k;
          table[j] = undefined;
          bitmap[kh] = (bitmap[kh]! & ~(1 << (j - kh))) | (1 << (idx - kh));
          hooks.onDisplace?.(k, j, idx);
          idx = j;
          moved = true;
          break;
        }
      }
      if (!moved) {
        hooks.onConclude?.(false);
        return false;
      }
    }
    table[idx] = key;
    bitmap[home]! |= 1 << (idx - home);
    hooks.onInsert?.(key, idx);
  }
  hooks.onConclude?.(true);
  return true;
}
