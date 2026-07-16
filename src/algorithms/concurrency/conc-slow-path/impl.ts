// Slow Path 互斥 · 实现（FIFO 公平队列）

export interface SpEvent {
  thread: number;
  action: 'lock' | 'unlock';
}

export interface SpStep {
  thread: number;
  action: string;
  state: number;
  queue: number[];
  holder: number;
}

export interface SpHooks {
  onEnqueue?: (thread: number, pos: number) => void;
  onAcquire?: (thread: number) => void;
  onRelease?: (thread: number) => void;
}

export function simulateSlowPath(
  nThreads: number,
  events: SpEvent[],
  hooks: SpHooks = {},
): SpStep[] {
  let state = 0; // 0 空闲, t+1 占用
  const queue: number[] = [];
  const steps: SpStep[] = [];

  for (const ev of events) {
    if (ev.action === 'lock') {
      // 总是入队
      queue.push(ev.thread);
      hooks.onEnqueue?.(ev.thread, queue.length);
      // 若自己是队首且锁空闲，立即获取
      if (queue[0] === ev.thread && state === 0) {
        queue.shift();
        state = ev.thread + 1;
        hooks.onAcquire?.(ev.thread);
      }
    } else {
      hooks.onRelease?.(ev.thread);
      if (queue.length > 0) {
        const next = queue.shift()!;
        state = next + 1;
        hooks.onAcquire?.(next);
      } else {
        state = 0;
      }
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      state,
      queue: [...queue],
      holder: state > 0 ? state - 1 : -1,
    });
  }
  void nThreads;
  return steps;
}
