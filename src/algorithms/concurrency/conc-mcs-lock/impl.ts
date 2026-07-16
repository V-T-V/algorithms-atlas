export interface McsHooks {
  onAcquire?: (tid: number) => void;
  onHandoff?: (from: number, to: number) => void;
}
export function mcsLock(threads: number[], hooks: McsHooks = {}): { order: number[] } {
  let tail: number | null = null;
  const order: number[] = [];
  const next: Map<number, number | null> = new Map();
  for (const t of threads) {
    next.set(t, null);
    const prev = tail;
    tail = t;
    if (prev === null) {
      hooks.onAcquire?.(t);
      order.push(t);
    } else {
      next.set(prev, t);
    }
  }
  let cur: number | null = threads[0] ?? null;
  while (cur !== null) {
    if (!order.includes(cur)) {
      order.push(cur);
      hooks.onAcquire?.(cur);
    }
    const nx = next.get(cur) ?? null;
    if (nx !== null) hooks.onHandoff?.(cur, nx);
    cur = nx;
  }
  return { order };
}
