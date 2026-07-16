// 异步队列 · 实现
export interface AqEvent {
  thread: number;
  action: 'enqueue' | 'dequeue';
  value?: number;
}
export interface AqHooks {
  onEnqueue?: (t: number, value: number, size: number) => void;
  onDequeue?: (t: number, value: number, size: number) => void;
  onWait?: (t: number) => void;
}
export interface AqStep {
  thread: number;
  queue: number[];
  waiters: number[];
}
export function simulateAsyncQueue(events: AqEvent[], hooks: AqHooks = {}): AqStep[] {
  const queue: number[] = [];
  const waiters: number[] = [];
  const steps: AqStep[] = [];
  for (const ev of events) {
    if (ev.action === 'enqueue') {
      const v = ev.value ?? 0;
      if (waiters.length > 0) {
        const w = waiters.shift()!;
        hooks.onDequeue?.(w, v, queue.length);
      } else {
        queue.push(v);
        hooks.onEnqueue?.(ev.thread, v, queue.length);
      }
    } else {
      if (queue.length > 0) {
        const v = queue.shift()!;
        hooks.onDequeue?.(ev.thread, v, queue.length);
      } else {
        waiters.push(ev.thread);
        hooks.onWait?.(ev.thread);
      }
    }
    steps.push({ thread: ev.thread, queue: [...queue], waiters: [...waiters] });
  }
  return steps;
}
