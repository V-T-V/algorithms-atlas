// TAS 自旋锁 · 实现（事件序列模拟）
export type TState = 'idle' | 'spinning' | 'critical';
export interface TasLEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface TasLStep {
  thread: number;
  action: string;
  flag: number;
  states: TState[];
  holder: number;
}
export interface TasLHooks {
  onSpin?: (t: number, attempt: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export function simulateTasLock(
  n: number,
  events: TasLEvent[],
  maxSpin = 4,
  hooks: TasLHooks = {},
): TasLStep[] {
  let flag = 0;
  let holder = -1;
  const states: TState[] = new Array(n).fill('idle');
  const steps: TasLStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      if (flag === 0) {
        flag = 1;
        states[ev.thread] = 'critical';
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread);
      } else {
        let a = 0;
        while (flag === 1 && a < maxSpin) {
          a++;
          hooks.onSpin?.(ev.thread, a);
        }
        if (flag === 0) {
          flag = 1;
          states[ev.thread] = 'critical';
          holder = ev.thread;
          hooks.onAcquire?.(ev.thread);
        } else states[ev.thread] = 'spinning';
      }
    } else {
      if (holder === ev.thread) {
        flag = 0;
        states[ev.thread] = 'idle';
        holder = -1;
        hooks.onRelease?.(ev.thread);
      }
    }
    steps.push({ thread: ev.thread, action: ev.action, flag, states: [...states], holder });
  }
  return steps;
}
