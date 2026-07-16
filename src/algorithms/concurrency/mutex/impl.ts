// =============================================================================
// 互斥锁（Mutex / TestAndSet）· 纯算法实现（事件序列模拟）
// 用原子 TestAndSet 模型实现互斥锁。零 DOM 依赖，可独立单测。
// 单线程模拟无法真正并发，故用「事件序列」确定性推进。
// =============================================================================

export interface MutexEvent {
  /** 发起事件的线程 id（0..nThreads-1）。 */
  thread: number;
  /** 'lock' 抢锁；'critical' 在临界区；'unlock' 释放锁。 */
  action: 'lock' | 'critical' | 'unlock';
}

export interface MutexHooks {
  /** 线程执行 TestAndSet，返回旧 flag（0=成功进入，1=被占）。 */
  onTestAndSet?: (thread: number, oldFlag: number, success: boolean) => void;
  /** 线程抢锁失败，进入等待队列。 */
  onBlock?: (thread: number, queueSize: number) => void;
  /** 线程进入临界区（获得锁）。 */
  onEnter?: (thread: number) => void;
  /** 线程释放锁（flag 置 0）。 */
  onRelease?: (thread: number) => void;
  /** 释放后唤醒队首等待者并交付锁。 */
  onWake?: (thread: number, woken: number) => void;
}

export type MutexThreadState = 'idle' | 'waiting' | 'critical';

export interface MutexStep {
  thread: number;
  action: MutexEvent['action'];
  /** 锁标志（0 空闲，1 占用）。 */
  flag: number;
  /** 各线程状态。 */
  states: MutexThreadState[];
  /** 当前持有锁的线程（-1 表示空闲）。 */
  holder: number;
}

/**
 * 互斥锁类（TestAndSet 模型）。
 */
export class Mutex {
  private flag = 0;
  private readonly queue: number[] = [];
  private readonly hooks: MutexHooks;

  constructor(hooks: MutexHooks = {}) {
    this.hooks = hooks;
  }

  /** 原子 TestAndSet：返回旧值并写入 1。 */
  testAndSet(thread: number): number {
    const old = this.flag;
    this.flag = 1;
    const success = old === 0;
    this.hooks.onTestAndSet?.(thread, old, success);
    return old;
  }

  get locked(): boolean {
    return this.flag === 1;
  }

  get waiting(): number[] {
    return [...this.queue];
  }

  /** lock：TestAndSet 成功则进入，否则入队等待。返回是否立即获得。 */
  lock(thread: number): boolean {
    const old = this.testAndSet(thread);
    if (old === 0) {
      this.hooks.onEnter?.(thread);
      return true;
    }
    this.queue.push(thread);
    this.hooks.onBlock?.(thread, this.queue.length);
    return false;
  }

  /** unlock：flag 置 0；若有等待者则直接交付给队首（避免竞争窗口）。 */
  unlock(thread: number): void {
    this.flag = 0;
    this.hooks.onRelease?.(thread);
    if (this.queue.length > 0) {
      const woken = this.queue.shift()!;
      // 直接交付：TestAndSet 必然成功（flag 刚置 0）
      this.flag = 1;
      this.hooks.onWake?.(thread, woken);
    }
  }
}

/**
 * 互斥锁模拟：按事件序列推进。
 *
 * @param nThreads 线程数
 * @param events 事件序列
 * @param hooks 可选钩子
 * @returns 每步状态快照
 */
export function simulateMutex(
  nThreads: number,
  events: MutexEvent[],
  hooks: MutexHooks = {},
): MutexStep[] {
  const mutex = new Mutex({
    ...hooks,
    onWake: (releaser, woken) => {
      states[woken] = 'critical';
      holder = woken;
      hooks.onWake?.(releaser, woken);
    },
  });
  const states: MutexThreadState[] = new Array(nThreads).fill('idle');
  const steps: MutexStep[] = [];
  let holder = -1;

  const snap = (thread: number, action: MutexEvent['action']): MutexStep => {
    const step: MutexStep = {
      thread,
      action,
      flag: mutex.locked ? 1 : 0,
      states: [...states],
      holder,
    };
    steps.push(step);
    return step;
  };

  for (const ev of events) {
    if (ev.action === 'lock') {
      const ok = mutex.lock(ev.thread);
      if (ok) {
        states[ev.thread] = 'critical';
        holder = ev.thread;
      } else {
        states[ev.thread] = 'waiting';
      }
      snap(ev.thread, ev.action);
    } else if (ev.action === 'critical') {
      snap(ev.thread, ev.action);
    } else {
      // unlock
      states[ev.thread] = 'idle';
      if (holder === ev.thread) holder = -1;
      mutex.unlock(ev.thread);
      snap(ev.thread, ev.action);
    }
  }

  return steps;
}
