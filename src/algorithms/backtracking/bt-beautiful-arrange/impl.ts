export interface BaHooks {
  onPlace?: (pos: number, v: number) => void;
  onResult?: (count: number) => void;
}
export function countArrangement(n: number, hooks: BaHooks = {}): number {
  const used = new Array(n + 1).fill(false);
  let count = 0;
  const go = (pos: number) => {
    if (pos > n) {
      count++;
      hooks.onResult?.(count);
      return;
    }
    for (let v = 1; v <= n; v++) {
      if (used[v]) continue;
      if (v % pos === 0 || pos % v === 0) {
        used[v] = true;
        hooks.onPlace?.(pos, v);
        go(pos + 1);
        used[v] = false;
      }
    }
  };
  go(1);
  return count;
}
