// BRLOCK · 实现
export interface BrEvent {
  thread: number;
  cpu: number;
  action: 'rlock' | 'runlock' | 'wlock' | 'wunlock';
}
export interface BrHooks {
  onReadAcquire?: (t: number, cpu: number) => void;
  onWriteAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BrStep {
  thread: number;
  perCpuReaders: number[];
  writerActive: boolean;
}
export function simulateBrLock(nCpu: number, events: BrEvent[], hooks: BrHooks = {}): BrStep[] {
  const perCpuReaders: number[] = new Array(nCpu).fill(0);
  let writerActive = false;
  const steps: BrStep[] = [];
  for (const ev of events) {
    if (ev.action === 'rlock') {
      if (!writerActive) {
        perCpuReaders[ev.cpu]!++;
        hooks.onReadAcquire?.(ev.thread, ev.cpu);
      }
    } else if (ev.action === 'runlock') {
      if (perCpuReaders[ev.cpu]! > 0) {
        perCpuReaders[ev.cpu]!--;
        hooks.onRelease?.(ev.thread);
      }
    } else if (ev.action === 'wlock') {
      const total = perCpuReaders.reduce((a, b) => a + b, 0);
      if (total === 0) {
        writerActive = true;
        hooks.onWriteAcquire?.(ev.thread);
      }
    } else if (writerActive) {
      writerActive = false;
      hooks.onRelease?.(ev.thread);
    }
    steps.push({ thread: ev.thread, perCpuReaders: [...perCpuReaders], writerActive });
  }
  return steps;
}
