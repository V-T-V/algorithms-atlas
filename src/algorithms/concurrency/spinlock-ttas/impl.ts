// =============================================================================
// TTAS 自旋锁（Test-and-Test-and-Set）· 纯算法实现（事件序列模拟）
// 先普通读自旋，读到空闲才发 TestAndSet。零 DOM 依赖，可独立单测。
// 统计普通读次数（cache-friendly）与原子写次数（bus traffic）。
// =============================================================================

export interface TtasEvent {
  /** 发起事件的线程 id。 */
  thread: number;
  /** 'lock' 抢锁；'critical' 临界区；'unlock' 释放。 */
  action: 'lock' | 'critical' | 'unlock';
}

export interface TtasHooks {
  /** 普通读 flag（缓存读）。给出读到的值。 */
  onRead?: (thread: number, flag: number) => void;
  /** 原子 TestAndSet。给出旧值与是否成功。 */
  onTestAndSet?: (thread: number, oldFlag: number, success: boolean) => void;
  /** 线程进入临界区。 */
  onEnter?: (thread: number) => void;
  /** 线程释放锁。 */
  onRelease?: (thread: number) => void;
}

export interface TtasStats {
  /** 普通读次数（缓存命中，开销低）。 */
  reads: number;
  /** TestAndSet 原子操作次数（总线争用）。 */
  testAndSets: number;
}

export type TtasThreadState = 'idle' | 'spinning' | 'critical';

export interface TtasStep {
  thread: number;
  action: TtasEvent['action'];
  flag: number;
  states: TtasThreadState[];
  holder: number;
  /** 累计统计（到本步）。 */
  stats: TtasStats;
}

export class TtasLock {
  private flag = 0;
  private readonly queue: number[] = [];
  readonly stats: TtasStats = { reads: 0, testAndSets: 0 };
  private readonly hooks: TtasHooks;

  constructor(hooks: TtasHooks = {}) {
    this.hooks = hooks;
  }

  get locked(): boolean {
    return this.flag === 1;
  }

  /** 普通读 flag（模拟缓存读，开销低）。 */
  read(thread: number): number {
    this.stats.reads++;
    this.hooks.onRead?.(thread, this.flag);
    return this.flag;
  }

  /** 原子 TestAndSet。 */
  testAndSet(thread: number): number {
    this.stats.testAndSets++;
    const old = this.flag;
    this.flag = 1;
    this.hooks.onTestAndSet?.(thread, old, old === 0);
    return old;
  }

  /**
   * TTAS lock：先普通读到空闲，再 TestAndSet。
   * 模拟版：单线程下不会有真正的「读到空闲却 TestAndSet 失败」，
   * 但我们保留语义——若队列中已有人等待（公平交付），新抢者入队。
   */
  lock(thread: number): boolean {
    // 模拟 TTAS 两阶段：先普通读
    if (this.read(thread) === 1) {
      // 被占 → 入队
      this.queue.push(thread);
      return false;
    }
    // 读到空闲 → 发 TestAndSet
    const old = this.testAndSet(thread);
    if (old === 0) {
      this.hooks.onEnter?.(thread);
      return true;
    }
    // 极端：读到空闲但 TestAndSet 失败（竞争）→ 入队
    this.queue.push(thread);
    return false;
  }

  unlock(thread: number): void {
    this.flag = 0;
    this.hooks.onRelease?.(thread);
    if (this.queue.length > 0) {
      const woken = this.queue.shift()!;
      // 唤醒等待者：经一次 TestAndSet 原子获取（计入 TAS 统计）
      this.testAndSet(woken);
      this.hooks.onEnter?.(woken);
    }
  }

  get waiting(): number[] {
    return [...this.queue];
  }
}

/**
 * TTAS 自旋锁模拟：按事件序列推进。
 *
 * @param nThreads 线程数
 * @param events 事件序列
 * @param hooks 可选钩子
 * @returns 每步状态快照与累计统计
 */
export function simulateTtas(
  nThreads: number,
  events: TtasEvent[],
  hooks: TtasHooks = {},
): TtasStep[] {
  const states: TtasThreadState[] = new Array(nThreads).fill('idle');
  const steps: TtasStep[] = [];
  let holder = -1;

  const wrapped: TtasHooks = {
    ...hooks,
    onEnter: (t) => {
      states[t] = 'critical';
      holder = t;
      hooks.onEnter?.(t);
    },
    onRelease: (t) => {
      states[t] = 'idle';
      if (holder === t) holder = -1;
      hooks.onRelease?.(t);
    },
  };
  const lock2 = new TtasLock(wrapped);

  const snap = (thread: number, action: TtasEvent['action']): TtasStep => {
    const step: TtasStep = {
      thread,
      action,
      flag: lock2.locked ? 1 : 0,
      states: [...states],
      holder,
      stats: { reads: lock2.stats.reads, testAndSets: lock2.stats.testAndSets },
    };
    steps.push(step);
    return step;
  };

  for (const ev of events) {
    if (ev.action === 'lock') {
      const ok = lock2.lock(ev.thread);
      if (!ok) states[ev.thread] = 'spinning';
      snap(ev.thread, ev.action);
    } else if (ev.action === 'critical') {
      snap(ev.thread, ev.action);
    } else {
      lock2.unlock(ev.thread);
      snap(ev.thread, ev.action);
    }
  }

  return steps;
}
