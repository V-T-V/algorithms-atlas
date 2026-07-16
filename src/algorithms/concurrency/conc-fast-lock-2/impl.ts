// Fast Lock v2 · 实现
export interface FlEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface FlHooks {
  onFastPath?: (t: number) => void;
  onSlowPath?: (t: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface FlStep {
  thread: number;
  state: 'free' | 'locked';
  queue: number[];
  holder: number;
}
export function simulateFastLock(events: FlEvent[], hooks: FlHooks = {}): FlStep[] {
  let state: 'free' | 'locked' = 'free';
  const queue: number[] = [];
  let holder = -1;
  const steps: FlStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      if (state === 'free') {
        state = 'locked';
        holder = ev.thread;
        hooks.onFastPath?.(ev.thread);
        hooks.onAcquire?.(ev.thread);
      } else {
        queue.push(ev.thread);
        hooks.onSlowPath?.(ev.thread);
      }
    } else if (holder === ev.thread) {
      if (queue.length > 0) {
        holder = queue.shift()!;
        hooks.onAcquire?.(holder);
      } else {
        state = 'free';
        holder = -1;
      }
      hooks.onRelease?.(ev.thread);
    }
    steps.push({ thread: ev.thread, state, queue: [...queue], holder });
  }
  return steps;
}
