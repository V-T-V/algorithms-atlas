// 写者优先锁 v2 · 实现
export interface WpEvent {
  thread: number;
  action: 'rlock' | 'runlock' | 'wlock' | 'wunlock';
}
export interface WpHooks {
  onReadAcquire?: (t: number) => void;
  onWriteAcquire?: (t: number) => void;
  onBlockReader?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface WpStep {
  thread: number;
  activeReaders: number;
  writerActive: boolean;
  writersWaiting: number;
}
export function simulateWriterPref(events: WpEvent[], hooks: WpHooks = {}): WpStep[] {
  let activeReaders = 0;
  let writerActive = false;
  let writersWaiting = 0;
  const steps: WpStep[] = [];
  for (const ev of events) {
    if (ev.action === 'rlock') {
      if (writerActive || writersWaiting > 0) hooks.onBlockReader?.(ev.thread);
      else {
        activeReaders++;
        hooks.onReadAcquire?.(ev.thread);
      }
    } else if (ev.action === 'runlock') {
      if (activeReaders > 0) {
        activeReaders--;
        hooks.onRelease?.(ev.thread);
      }
    } else if (ev.action === 'wlock') {
      if (writerActive || activeReaders > 0) writersWaiting++;
      else {
        writerActive = true;
        hooks.onWriteAcquire?.(ev.thread);
      }
    } else if (ev.action === 'wunlock') {
      if (writerActive) {
        writerActive = false;
        hooks.onRelease?.(ev.thread);
      }
      if (writersWaiting > 0) {
        writersWaiting--;
        writerActive = true;
        hooks.onWriteAcquire?.(-1);
      }
    }
    steps.push({ thread: ev.thread, activeReaders, writerActive, writersWaiting });
  }
  return steps;
}
