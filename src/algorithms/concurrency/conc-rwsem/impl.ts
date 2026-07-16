// 读写信号量 · 实现
export interface RwsEvent {
  thread: number;
  action: 'down_read' | 'up_read' | 'down_write' | 'up_write' | 'downgrade';
}
export interface RwsHooks {
  onReadAcquire?: (t: number, n: number) => void;
  onWriteAcquire?: (t: number) => void;
  onDowngrade?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface RwsStep {
  thread: number;
  readers: number;
  writer: number;
}
export function simulateRwSem(events: RwsEvent[], hooks: RwsHooks = {}): RwsStep[] {
  let readers = 0;
  let writer = -1;
  const steps: RwsStep[] = [];
  for (const ev of events) {
    if (ev.action === 'down_read') {
      if (writer === -1) {
        readers++;
        hooks.onReadAcquire?.(ev.thread, readers);
      }
    } else if (ev.action === 'up_read') {
      if (readers > 0) {
        readers--;
        hooks.onRelease?.(ev.thread);
      }
    } else if (ev.action === 'down_write') {
      if (writer === -1 && readers === 0) {
        writer = ev.thread;
        hooks.onWriteAcquire?.(ev.thread);
      }
    } else if (ev.action === 'up_write') {
      if (writer === ev.thread) {
        writer = -1;
        hooks.onRelease?.(ev.thread);
      }
    } else if (ev.action === 'downgrade') {
      if (writer === ev.thread) {
        writer = -1;
        readers++;
        hooks.onDowngrade?.(ev.thread);
      }
    }
    steps.push({ thread: ev.thread, readers, writer });
  }
  return steps;
}
