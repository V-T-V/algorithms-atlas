// Slow Path Lock v2 · 实现
export interface SlEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface SlHooks {
  onEnqueue?: (t: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface SlStep {
  thread: number;
  queue: number[];
  holder: number;
}
export function simulateSlowLock(events: SlEvent[], hooks: SlHooks = {}): SlStep[] {
  const queue: number[] = [];
  let holder = -1;
  const steps: SlStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      queue.push(ev.thread);
      hooks.onEnqueue?.(ev.thread);
      if (holder === -1) {
        holder = queue.shift()!;
        hooks.onAcquire?.(holder);
      }
    } else if (holder === ev.thread) {
      hooks.onRelease?.(ev.thread);
      holder = queue.length > 0 ? queue.shift()! : -1;
      if (holder !== -1) hooks.onAcquire?.(holder);
    }
    steps.push({ thread: ev.thread, queue: [...queue], holder });
  }
  return steps;
}
