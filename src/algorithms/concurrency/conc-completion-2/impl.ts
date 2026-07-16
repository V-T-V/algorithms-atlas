// 完成锁存器 v2 · 实现
export interface CompEvent {
  thread: number;
  action: 'await' | 'count_down';
}
export interface CompHooks {
  onAwait?: (t: number, count: number) => void;
  onCountDown?: (t: number, count: number) => void;
  onComplete?: (woken: number) => void;
}
export interface CompStep {
  thread: number;
  count: number;
  waiters: number[];
}
export function simulateCompletion(
  initial: number,
  events: CompEvent[],
  hooks: CompHooks = {},
): CompStep[] {
  let count = initial;
  const waiters: number[] = [];
  const steps: CompStep[] = [];
  for (const ev of events) {
    if (ev.action === 'await') {
      if (count > 0) waiters.push(ev.thread);
      hooks.onAwait?.(ev.thread, count);
    } else {
      if (count > 0) {
        count--;
        hooks.onCountDown?.(ev.thread, count);
        if (count === 0) {
          hooks.onComplete?.(waiters.length);
          waiters.length = 0;
        }
      }
    }
    steps.push({ thread: ev.thread, count, waiters: [...waiters] });
  }
  return steps;
}
