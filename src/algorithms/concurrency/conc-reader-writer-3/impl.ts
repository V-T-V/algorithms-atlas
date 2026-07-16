// Reader-Writer Lock v3 · 实现
export interface RwEvent {
  thread: number;
  action: 'rlock' | 'runlock' | 'wlock' | 'wunlock';
}
export interface RwHooks {
  onReadAcquire?: (t: number, active: number) => void;
  onWriteAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
  onBlock?: (t: number, reason: string) => void;
}
export interface RwStep {
  thread: number;
  activeReaders: number;
  writerActive: boolean;
  writerWaiting: number;
}
export function simulateRwLock(events: RwEvent[], hooks: RwHooks = {}): RwStep[] {
  let activeReaders = 0;
  let writerActive = false;
  let writerWaiting = 0;
  const steps: RwStep[] = [];
  for (const ev of events) {
    if (ev.action === 'rlock') {
      if (writerActive || writerWaiting > 0) hooks.onBlock?.(ev.thread, 'writer');
      else {
        activeReaders++;
        hooks.onReadAcquire?.(ev.thread, activeReaders);
      }
    } else if (ev.action === 'runlock') {
      if (activeReaders > 0) {
        activeReaders--;
        hooks.onRelease?.(ev.thread);
      }
    } else if (ev.action === 'wlock') {
      if (writerActive || activeReaders > 0) {
        writerWaiting++;
        hooks.onBlock?.(ev.thread, 'busy');
      } else {
        writerActive = true;
        hooks.onWriteAcquire?.(ev.thread);
      }
    } else if (ev.action === 'wunlock') {
      if (writerActive) {
        writerActive = false;
        hooks.onRelease?.(ev.thread);
      }
    }
    steps.push({ thread: ev.thread, activeReaders, writerActive, writerWaiting });
  }
  return steps;
}
