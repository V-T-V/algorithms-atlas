// 时间优先锁 · 实现
export interface TpEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface TpHooks {
  onWait?: (t: number, time: number) => void;
  onAcquire?: (t: number, waitTime: number) => void;
  onRelease?: (t: number) => void;
}
export interface TpStep {
  thread: number;
  holder: number;
  waiters: Array<{ t: number; since: number }>;
}
export function simulateTimePriority(events: TpEvent[], hooks: TpHooks = {}): TpStep[] {
  let holder = -1;
  const waiters: Array<{ t: number; since: number }> = [];
  let clock = 0;
  const steps: TpStep[] = [];
  for (const ev of events) {
    clock++;
    if (ev.action === 'lock') {
      if (holder === -1) {
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread, 0);
      } else {
        waiters.push({ t: ev.thread, since: clock });
        hooks.onWait?.(ev.thread, clock);
      }
    } else if (holder === ev.thread) {
      hooks.onRelease?.(ev.thread);
      if (waiters.length > 0) {
        // 选等待最久的（since 最小）
        waiters.sort((a, b) => a.since - b.since);
        const next = waiters.shift()!;
        holder = next.t;
        hooks.onAcquire?.(next.t, clock - next.since);
      } else holder = -1;
    }
    steps.push({ thread: ev.thread, holder, waiters: [...waiters] });
  }
  return steps;
}
