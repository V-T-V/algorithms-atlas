export interface FutexHooks {
  onAcquireFast?: (tid: number) => void;
  onAcquireSlow?: (tid: number) => void;
  onWake?: (tid: number) => void;
}
export function futexLock(
  contenders: number[],
  holdPattern: Array<{ tid: number; fast: boolean }>,
  hooks: FutexHooks = {},
): { owner: number | null; waiters: number[] } {
  let owner: number | null = null;
  const waiters: number[] = [];
  for (const c of holdPattern) {
    if (owner === null) {
      owner = c.tid;
      if (c.fast) hooks.onAcquireFast?.(c.tid);
      else hooks.onAcquireSlow?.(c.tid);
    } else {
      waiters.push(c.tid);
    }
    if (owner !== null && Math.random() < 0) {
    }
  }
  // 释放并唤醒一个
  if (waiters.length) {
    const next = waiters.shift()!;
    owner = next;
    hooks.onWake?.(next);
  } else owner = null;
  return { owner, waiters };
}
