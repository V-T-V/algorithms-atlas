// 事件计数器 · 实现
export interface EcEvent {
  thread: number;
  action: 'await' | 'advance';
  ticket?: number;
}
export interface EcHooks {
  onAwait?: (t: number, ticket: number, count: number) => void;
  onAdvance?: (t: number, count: number, woken: number) => void;
  onWake?: (t: number, ticket: number) => void;
}
export interface EcStep {
  thread: number;
  count: number;
  waiters: Array<{ t: number; ticket: number }>;
}
export function simulateEventCount(events: EcEvent[], hooks: EcHooks = {}): EcStep[] {
  let count = 0;
  const waiters: Array<{ t: number; ticket: number }> = [];
  const steps: EcStep[] = [];
  for (const ev of events) {
    if (ev.action === 'await') {
      const ticket = ev.ticket ?? count + 1;
      if (count < ticket) {
        waiters.push({ t: ev.thread, ticket });
        hooks.onAwait?.(ev.thread, ticket, count);
      } else hooks.onAwait?.(ev.thread, ticket, count);
    } else {
      count++;
      const woken: number[] = [];
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (count >= waiters[i]!.ticket) {
          woken.unshift(waiters[i]!.t);
          hooks.onWake?.(waiters[i]!.t, waiters[i]!.ticket);
          waiters.splice(i, 1);
        }
      }
      hooks.onAdvance?.(ev.thread, count, woken.length);
    }
    steps.push({ thread: ev.thread, count, waiters: [...waiters] });
  }
  return steps;
}
