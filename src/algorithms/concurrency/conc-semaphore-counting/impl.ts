// 计数信号量 · 实现
export interface SemEvent {
  thread: number;
  action: 'wait' | 'signal';
}
export interface SemHooks {
  onAcquire?: (t: number, count: number) => void;
  onBlock?: (t: number, waiters: number) => void;
  onRelease?: (t: number, count: number) => void;
}
export interface SemStep {
  thread: number;
  count: number;
  waiters: number[];
}
export function simulateCountingSem(
  initial: number,
  events: SemEvent[],
  hooks: SemHooks = {},
): SemStep[] {
  let count = initial;
  const waiters: number[] = [];
  const steps: SemStep[] = [];
  for (const ev of events) {
    if (ev.action === 'wait') {
      count--;
      if (count < 0) {
        waiters.push(ev.thread);
        hooks.onBlock?.(ev.thread, waiters.length);
      } else hooks.onAcquire?.(ev.thread, count);
    } else {
      count++;
      if (waiters.length > 0) {
        count--;
        const w = waiters.shift()!;
        hooks.onAcquire?.(w, count);
      } else hooks.onRelease?.(ev.thread, count);
    }
    steps.push({ thread: ev.thread, count, waiters: [...waiters] });
  }
  return steps;
}
