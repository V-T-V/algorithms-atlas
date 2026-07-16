// Fast Path 互斥 · 实现

export interface FpEvent {
  thread: number;
  action: 'lock' | 'unlock';
}

export interface FpStep {
  thread: number;
  action: string;
  state: number; // 0 空闲, >0 占用（=持有线程+1）
  queue: number[];
  path: 'fast' | 'slow';
  holder: number;
}

export interface FpHooks {
  onFastPath?: (thread: number) => void;
  onSlowPath?: (thread: number) => void;
  onAcquire?: (thread: number) => void;
  onRelease?: (thread: number) => void;
}

export function simulateFastPath(
  nThreads: number,
  events: FpEvent[],
  hooks: FpHooks = {},
): FpStep[] {
  let state = 0; // 0 空闲, t+1 表示线程 t 持有
  const queue: number[] = [];
  const steps: FpStep[] = [];

  for (const ev of events) {
    let path: 'fast' | 'slow' = 'fast';
    if (ev.action === 'lock') {
      // CAS(0 -> ev.thread+1)
      if (state === 0) {
        state = ev.thread + 1;
        hooks.onFastPath?.(ev.thread);
        hooks.onAcquire?.(ev.thread);
        path = 'fast';
      } else {
        queue.push(ev.thread);
        hooks.onSlowPath?.(ev.thread);
        path = 'slow';
      }
    } else {
      // unlock
      hooks.onRelease?.(ev.thread);
      if (queue.length > 0) {
        const next = queue.shift()!;
        state = next + 1;
        hooks.onAcquire?.(next);
        path = 'slow';
      } else {
        state = 0;
        path = 'fast';
      }
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      state,
      queue: [...queue],
      path,
      holder: state > 0 ? state - 1 : -1,
    });
  }
  return steps;
}
