// RCU v2 · 实现
export interface RcuEvent {
  thread: number;
  action: 'read-enter' | 'read-exit' | 'update' | 'synchronize';
}
export interface RcuHooks {
  onReadEnter?: (t: number, readers: number) => void;
  onReadExit?: (t: number, readers: number) => void;
  onUpdate?: (t: number, version: number) => void;
  onGracePeriod?: (t: number, reclaimed: number) => void;
}
export interface RcuStep {
  thread: number;
  version: number;
  activeReaders: number;
  pendingReclaim: number[];
}
export function simulateRcu(events: RcuEvent[], hooks: RcuHooks = {}): RcuStep[] {
  let version = 1;
  const activeReaders = new Set<number>();
  const pendingReclaim: number[] = [];
  const steps: RcuStep[] = [];
  for (const ev of events) {
    if (ev.action === 'read-enter') {
      activeReaders.add(ev.thread);
      hooks.onReadEnter?.(ev.thread, activeReaders.size);
    } else if (ev.action === 'read-exit') {
      activeReaders.delete(ev.thread);
      hooks.onReadExit?.(ev.thread, activeReaders.size);
    } else if (ev.action === 'update') {
      pendingReclaim.push(version);
      version++;
      hooks.onUpdate?.(ev.thread, version);
    } else {
      const n = pendingReclaim.length;
      if (activeReaders.size === 0) {
        pendingReclaim.length = 0;
        hooks.onGracePeriod?.(ev.thread, n);
      } else hooks.onGracePeriod?.(ev.thread, 0);
    }
    steps.push({
      thread: ev.thread,
      version,
      activeReaders: activeReaders.size,
      pendingReclaim: [...pendingReclaim],
    });
  }
  return steps;
}
