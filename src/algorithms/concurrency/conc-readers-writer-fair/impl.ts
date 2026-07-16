// 公平读写锁 · 实现

export type RwRole = 'reader' | 'writer';

export interface RwEvent {
  thread: number;
  role: RwRole;
  action: 'acquire' | 'release';
}

export interface RwStep {
  thread: number;
  action: string;
  activeReaders: number;
  activeWriter: number;
  waiters: Array<{ thread: number; role: RwRole }>;
}

export interface RwHooks {
  onGrant?: (thread: number, role: RwRole) => void;
  onWait?: (thread: number, role: RwRole) => void;
  onRelease?: (thread: number, role: RwRole) => void;
}

export function simulateRwFair(events: RwEvent[], hooks: RwHooks = {}): RwStep[] {
  let activeReaders = 0;
  let activeWriter = 0;
  const waiters: Array<{ thread: number; role: RwRole }> = [];
  const steps: RwStep[] = [];

  const tryDispatch = (): void => {
    if (waiters.length === 0) return;
    const head = waiters[0]!;
    if (head.role === 'writer') {
      if (activeReaders === 0 && activeWriter === 0) {
        waiters.shift();
        activeWriter = 1;
        hooks.onGrant?.(head.thread, head.role);
      }
    } else {
      // reader：只要没有 writer 占用，且队首不是等待中的 writer
      if (activeWriter === 0) {
        // 连续 dispatch 队首的 readers
        while (waiters.length > 0 && waiters[0]!.role === 'reader') {
          const r = waiters.shift()!;
          activeReaders++;
          hooks.onGrant?.(r.thread, r.role);
        }
      }
    }
  };

  for (const ev of events) {
    if (ev.action === 'acquire') {
      if (ev.role === 'reader') {
        if (
          activeWriter === 0 &&
          !(waiters.length > 0 && waiters.some((w) => w.role === 'writer'))
        ) {
          activeReaders++;
          hooks.onGrant?.(ev.thread, ev.role);
        } else {
          waiters.push({ thread: ev.thread, role: ev.role });
          hooks.onWait?.(ev.thread, ev.role);
        }
      } else {
        if (activeReaders === 0 && activeWriter === 0) {
          activeWriter = 1;
          hooks.onGrant?.(ev.thread, ev.role);
        } else {
          waiters.push({ thread: ev.thread, role: ev.role });
          hooks.onWait?.(ev.thread, ev.role);
        }
      }
    } else {
      // release
      hooks.onRelease?.(ev.thread, ev.role);
      if (ev.role === 'reader') activeReaders = Math.max(0, activeReaders - 1);
      else activeWriter = 0;
      tryDispatch();
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      activeReaders,
      activeWriter,
      waiters: [...waiters],
    });
  }
  return steps;
}
