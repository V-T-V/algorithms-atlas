export interface PqlHooks {
  onAcquire?: (tid: number, prio: number) => void;
  onWait?: (tid: number, prio: number) => void;
}
export function priorityQueueLock(
  threads: Array<{ tid: number; prio: number }>,
  hooks: PqlHooks = {},
): number[] {
  const order: number[] = [];
  const wait = [...threads];
  while (wait.length) {
    wait.sort((a, b) => b.prio - a.prio);
    const top = wait.shift()!;
    hooks.onAcquire?.(top.tid, top.prio);
    order.push(top.tid);
    for (const w of wait) hooks.onWait?.(w.tid, w.prio);
  }
  return order;
}
