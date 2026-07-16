export interface ClhHooks {
  onAcquire?: (tid: number) => void;
  onSpin?: (tid: number, pred: number) => void;
}
export function clhLock(threads: number[], hooks: ClhHooks = {}): number[] {
  const order: number[] = [];
  let tail = 0;
  const locked = new Map<number, boolean>([[0, false]]);
  for (const t of threads) {
    locked.set(t, true);
    const pred = tail;
    tail = t;
    hooks.onSpin?.(t, pred);
    while (locked.get(pred)) {}
    hooks.onAcquire?.(t);
    order.push(t);
    locked.set(t, false);
  }
  return order;
}
