// 二值信号量 · 实现
export interface BsEvent {
  thread: number;
  action: 'wait' | 'signal';
}
export interface BsHooks {
  onAcquire?: (t: number) => void;
  onBlock?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BsStep {
  thread: number;
  value: 0 | 1;
  holder: number;
  waiters: number[];
}
export function simulateBinarySem(events: BsEvent[], hooks: BsHooks = {}): BsStep[] {
  let value: 0 | 1 = 1;
  let holder = -1;
  const waiters: number[] = [];
  const steps: BsStep[] = [];
  for (const ev of events) {
    if (ev.action === 'wait') {
      if (value === 1) {
        value = 0;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread);
      } else {
        waiters.push(ev.thread);
        hooks.onBlock?.(ev.thread);
      }
    } else {
      if (waiters.length > 0) {
        const w = waiters.shift()!;
        holder = w;
        hooks.onAcquire?.(w);
      } else {
        value = 1;
        holder = -1;
        hooks.onRelease?.(ev.thread);
      }
    }
    steps.push({ thread: ev.thread, value, holder, waiters: [...waiters] });
  }
  return steps;
}
