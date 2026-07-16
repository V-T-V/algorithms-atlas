// 戳印序列 · 实现（反向贪心：找出可被一次 stamp 替换回 '?' 的窗口）
export interface StampHooks {
  onUnstamp?: (idx: number) => void;
  onConclude?: (order: number[], ok: boolean) => void;
}
export interface StampResult {
  order: number[];
  ok: boolean;
}
export function greedyStamping2(
  stamp: string,
  target: string,
  hooks: StampHooks = {},
): StampResult {
  const m = stamp.length;
  const n = target.length;
  if (m > n) return { order: [], ok: false };
  const t = target.split('');
  const done = new Array(n).fill(false);
  const order: number[] = [];
  const tryUnstamp = (start: number): boolean => {
    let matched = false;
    for (let i = 0; i < m; i++) {
      const ti = start + i;
      if (done[ti]) continue;
      if (t[ti] !== stamp[i]) return false;
      matched = true;
    }
    if (!matched) return false;
    for (let i = 0; i < m; i++) {
      t[start + i] = '?';
      done[start + i] = true;
    }
    return true;
  };
  let changed = true;
  while (changed && order.length < 10 * n) {
    changed = false;
    for (let i = 0; i + m <= n; i++) {
      if (tryUnstamp(i)) {
        order.push(i);
        hooks.onUnstamp?.(i);
        changed = true;
      }
    }
  }
  const fullyDone = done.every(Boolean);
  hooks.onConclude?.(order, fullyDone);
  return { order: order.reverse(), ok: fullyDone };
}
