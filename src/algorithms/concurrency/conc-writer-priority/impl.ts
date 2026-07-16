// 写者优先读写锁 · 实现

export type RwRole = 'reader' | 'writer';

export interface WpEvent {
  thread: number;
  role: RwRole;
  action: 'acquire' | 'release';
}

export interface WpStep {
  thread: number;
  action: string;
  activeReaders: number;
  activeWriter: number;
  waitingWriters: number;
  waitingReaders: number;
}

export interface WpHooks {
  onGrant?: (thread: number, role: RwRole) => void;
  onWait?: (thread: number, role: RwRole) => void;
  onRelease?: (thread: number, role: RwRole) => void;
}

export function simulateWriterPriority(events: WpEvent[], hooks: WpHooks = {}): WpStep[] {
  let activeReaders = 0;
  let activeWriter = 0;
  let waitingWriters = 0;
  let waitingReaders = 0;
  const steps: WpStep[] = [];

  const tryWriters = (): void => {
    if (activeReaders === 0 && activeWriter === 0 && waitingWriters > 0) {
      waitingWriters--;
      activeWriter = 1;
    }
  };
  const tryReaders = (): void => {
    if (activeWriter === 0 && waitingWriters === 0) {
      while (waitingReaders > 0) {
        waitingReaders--;
        activeReaders++;
      }
    }
  };

  for (const ev of events) {
    if (ev.action === 'acquire') {
      if (ev.role === 'writer') {
        if (activeReaders === 0 && activeWriter === 0) {
          activeWriter = 1;
          hooks.onGrant?.(ev.thread, ev.role);
        } else {
          waitingWriters++;
          hooks.onWait?.(ev.thread, ev.role);
        }
      } else {
        // reader: 若有写者占用或等待，则排队
        if (activeWriter === 0 && waitingWriters === 0) {
          activeReaders++;
          hooks.onGrant?.(ev.thread, ev.role);
        } else {
          waitingReaders++;
          hooks.onWait?.(ev.thread, ev.role);
        }
      }
    } else {
      hooks.onRelease?.(ev.thread, ev.role);
      if (ev.role === 'writer') activeWriter = 0;
      else activeReaders = Math.max(0, activeReaders - 1);
      tryWriters();
      tryReaders();
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      activeReaders,
      activeWriter,
      waitingWriters,
      waitingReaders,
    });
  }
  return steps;
}
