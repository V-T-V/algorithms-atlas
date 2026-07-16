// 条件变量 v3 · 实现
export interface CvEvent {
  thread: number;
  action: 'wait' | 'signal' | 'broadcast';
}
export interface CvHooks {
  onWait?: (t: number, waiting: number) => void;
  onSignal?: (signaler: number, wakee: number) => void;
  onBroadcast?: (signaler: number, woken: number) => void;
}
export interface CvStep {
  thread: number;
  waiting: number[];
}
export function simulateCondVar(events: CvEvent[], hooks: CvHooks = {}): CvStep[] {
  const waiting: number[] = [];
  const steps: CvStep[] = [];
  for (const ev of events) {
    if (ev.action === 'wait') {
      waiting.push(ev.thread);
      hooks.onWait?.(ev.thread, waiting.length);
    } else if (ev.action === 'signal') {
      if (waiting.length > 0) {
        const w = waiting.shift()!;
        hooks.onSignal?.(ev.thread, w);
      }
    } else {
      const n = waiting.length;
      waiting.length = 0;
      hooks.onBroadcast?.(ev.thread, n);
    }
    steps.push({ thread: ev.thread, waiting: [...waiting] });
  }
  return steps;
}
