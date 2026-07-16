// =============================================================================
// 读写锁（读者优先）· 纯算法实现（事件序列模拟）
// 读锁共享、写锁独占。零 DOM 依赖，可独立单测。
// =============================================================================

export interface RwLockEvent {
  /** 发起事件的线程 id。 */
  thread: number;
  /** 'readLock'/'readUnlock'/'writeLock'/'writeUnlock'。 */
  action: 'readLock' | 'readUnlock' | 'writeLock' | 'writeUnlock';
}

export interface RwLockHooks {
  /** 读者进入。给出当前并发读者数。 */
  onReaderEnter?: (thread: number, activeReaders: number) => void;
  /** 读者阻塞（有写者）。 */
  onReaderBlock?: (thread: number) => void;
  /** 读者离开。给出剩余并发读者数。 */
  onReaderLeave?: (thread: number, activeReaders: number) => void;
  /** 写者进入。 */
  onWriterEnter?: (thread: number) => void;
  /** 写者阻塞（有读者或写者）。 */
  onWriterBlock?: (thread: number) => void;
  /** 写者离开。 */
  onWriterLeave?: (thread: number) => void;
}

export type RwThreadState = 'idle' | 'reading' | 'writing' | 'waiting-read' | 'waiting-write';

export interface RwLockStep {
  thread: number;
  action: RwLockEvent['action'];
  /** 当前持有读锁的线程数。 */
  activeReaders: number;
  /** 当前是否被写者持有（0/1）。 */
  activeWriter: number;
  /** 持有写锁的线程（-1 无）。 */
  writerHolder: number;
  /** 各线程状态。 */
  states: RwThreadState[];
}

/**
 * 读写锁模拟（读者优先）。
 *
 * 规则：
 *  - readLock：无写者持有 → 进入（readers++）；否则入读等待
 *  - readUnlock：readers--；归零时若写等待队列非空，唤醒队首写者
 *  - writeLock：readers=0 且无写者 → 进入；否则入写等待
 *  - writeUnlock：若读等待非空，全部唤醒（读者优先）；否则唤醒一个写等待
 *
 * @param nThreads 线程数
 * @param events 事件序列
 * @param hooks 可选钩子
 * @returns 每步状态快照
 */
export function simulateReadWriteLock(
  nThreads: number,
  events: RwLockEvent[],
  hooks: RwLockHooks = {},
): RwLockStep[] {
  const states: RwThreadState[] = new Array(nThreads).fill('idle');
  let activeReaders = 0;
  let writerHolder = -1;
  const readWaiters: number[] = [];
  const writeWaiters: number[] = [];
  const steps: RwLockStep[] = [];

  const snap = (thread: number, action: RwLockEvent['action']): RwLockStep => {
    const step: RwLockStep = {
      thread,
      action,
      activeReaders,
      activeWriter: writerHolder === -1 ? 0 : 1,
      writerHolder,
      states: [...states],
    };
    steps.push(step);
    return step;
  };

  // 释放后调度：写者优先级低于读者（读者优先策略）
  const scheduleAfterRelease = (): void => {
    // 若有读等待：全部进入（读者优先）
    while (readWaiters.length > 0 && writerHolder === -1) {
      const t = readWaiters.shift()!;
      activeReaders++;
      states[t] = 'reading';
      hooks.onReaderEnter?.(t, activeReaders);
    }
    // 若仍有空位且无写者但有写等待：本策略在读者全部离开后才让写者进
    if (activeReaders === 0 && writerHolder === -1 && writeWaiters.length > 0) {
      const w = writeWaiters.shift()!;
      writerHolder = w;
      states[w] = 'writing';
      hooks.onWriterEnter?.(w);
    }
  };

  for (const ev of events) {
    const t = ev.thread;
    if (ev.action === 'readLock') {
      if (writerHolder === -1) {
        activeReaders++;
        states[t] = 'reading';
        hooks.onReaderEnter?.(t, activeReaders);
      } else {
        readWaiters.push(t);
        states[t] = 'waiting-read';
        hooks.onReaderBlock?.(t);
      }
      snap(t, ev.action);
    } else if (ev.action === 'readUnlock') {
      if (states[t] === 'reading') {
        activeReaders--;
        states[t] = 'idle';
        hooks.onReaderLeave?.(t, activeReaders);
        scheduleAfterRelease();
      }
      snap(t, ev.action);
    } else if (ev.action === 'writeLock') {
      if (writerHolder === -1 && activeReaders === 0) {
        writerHolder = t;
        states[t] = 'writing';
        hooks.onWriterEnter?.(t);
      } else {
        writeWaiters.push(t);
        states[t] = 'waiting-write';
        hooks.onWriterBlock?.(t);
      }
      snap(t, ev.action);
    } else {
      // writeUnlock
      if (writerHolder === t) {
        writerHolder = -1;
        states[t] = 'idle';
        hooks.onWriterLeave?.(t);
        scheduleAfterRelease();
      }
      snap(t, ev.action);
    }
  }

  return steps;
}
