// =============================================================================
// 闭锁（CountDownLatch）· 纯算法实现（事件序列模拟）
// 一次性计数门：countDown 减一，归零前 await 阻塞。零 DOM 依赖，可独立单测。
// =============================================================================

export interface LatchEvent {
  /** 发起事件的线程 id。 */
  thread: number;
  /** 'await' 等待归零；'countDown' 计数减一。 */
  action: 'await' | 'countDown';
}

export interface LatchHooks {
  /** 线程调用 await，给出是否立即返回（count 已为 0）还是阻塞。 */
  onAwait?: (thread: number, count: number, blocked: boolean) => void;
  /** 线程调用 countDown，给出减一后的计数。 */
  onCountDown?: (thread: number, newCount: number) => void;
  /** 计数归零，全部等待者被唤醒。给出被唤醒线程列表。 */
  onRelease?: (woken: number[]) => void;
}

export type LatchThreadState = 'idle' | 'waiting' | 'released';

export interface LatchStep {
  thread: number;
  action: LatchEvent['action'];
  /** 当前计数。 */
  count: number;
  /** 各线程状态。 */
  states: LatchThreadState[];
  /** 等待中的线程集合。 */
  waiters: number[];
}

/**
 * 闭锁类（CountDownLatch）。
 */
export class Latch {
  private count: number;
  private readonly waiters: number[] = [];
  private readonly hooks: LatchHooks;

  constructor(initialCount: number, hooks: LatchHooks = {}) {
    this.count = Math.max(0, Math.floor(initialCount));
    this.hooks = hooks;
  }

  get remaining(): number {
    return this.count;
  }

  get waiting(): number[] {
    return [...this.waiters];
  }

  /** 是否已打开（count=0）。 */
  get isOpen(): boolean {
    return this.count === 0;
  }

  /** await：count=0 立即返回，否则阻塞入队。返回是否立即通过。 */
  await(thread: number): boolean {
    if (this.count === 0) {
      this.hooks.onAwait?.(thread, 0, false);
      return true;
    }
    this.waiters.push(thread);
    this.hooks.onAwait?.(thread, this.count, true);
    return false;
  }

  /** countDown：count--，归零时唤醒全部等待者。返回是否触发了释放。 */
  countDown(thread: number): boolean {
    if (this.count === 0) {
      this.hooks.onCountDown?.(thread, 0);
      return false;
    }
    this.count--;
    this.hooks.onCountDown?.(thread, this.count);
    if (this.count === 0) {
      const woken = [...this.waiters];
      this.waiters.length = 0;
      this.hooks.onRelease?.(woken);
      return true;
    }
    return false;
  }
}

/**
 * 闭锁模拟：按事件序列推进。
 *
 * @param initialCount 初始计数
 * @param nThreads 线程数
 * @param events 事件序列
 * @param hooks 可选钩子
 * @returns 每步状态快照
 */
export function simulateLatch(
  initialCount: number,
  nThreads: number,
  events: LatchEvent[],
  hooks: LatchHooks = {},
): LatchStep[] {
  const states: LatchThreadState[] = new Array(nThreads).fill('idle');
  const steps: LatchStep[] = [];

  const wrappedHooks: LatchHooks = {
    ...hooks,
    onAwait: (thread, count, blocked) => {
      if (blocked) {
        states[thread] = 'waiting';
      } else {
        // count 已为 0：await 立即通过 → released
        states[thread] = 'released';
      }
      hooks.onAwait?.(thread, count, blocked);
    },
    onRelease: (woken) => {
      for (const t of woken) states[t] = 'released';
      hooks.onRelease?.(woken);
    },
  };
  const latch2 = new Latch(initialCount, wrappedHooks);

  for (const ev of events) {
    if (ev.action === 'await') {
      latch2.await(ev.thread);
    } else {
      latch2.countDown(ev.thread);
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      count: latch2.remaining,
      states: [...states],
      waiters: latch2.waiting,
    });
  }

  return steps;
}
