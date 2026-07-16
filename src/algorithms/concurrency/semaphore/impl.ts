// =============================================================================
// 信号量（Semaphore）· 纯算法实现（事件序列模拟）
// 零 DOM 依赖，可独立单测。纯 TS 单线程无法真正并发，故用「事件序列」确定性模拟：
// 输入一串 acquire/release 事件，按顺序推进计数与等待队列，输出每步后的状态。
// =============================================================================

/** 单个事件。 */
export interface SemaphoreEvent {
  /** 'acquire' 请求许可；'release' 归还许可。 */
  type: 'acquire' | 'release';
  /** 发起事件的线程 id（仅用于追踪与展示）。 */
  threadId?: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SemaphoreHooks {
  /** acquire 成功：当前许可数 value。 */
  onAcquire?: (value: number) => void;
  /** acquire 时计数为 0，线程阻塞入队。给出阻塞线程 id（或事件序号）。 */
  onBlock?: (threadId: number) => void;
  /** release 唤醒一个等待线程并立刻交付许可。给出被唤醒线程 id 与交付后计数。 */
  onWake?: (threadId: number, value: number) => void;
  /** release 且无等待者：计数 +1。给出 release 后的计数。 */
  onRelease?: (value: number) => void;
}

/** 每个事件处理后的快照记录。 */
export interface SemaphoreStep {
  /** 触发本步的事件。 */
  event: SemaphoreEvent['type'];
  /** 处理后许可数。 */
  value: number;
  /** 处理后等待队列长度。 */
  queueSize: number;
}

/**
 * 计数信号量类（事件序列模拟版）。
 *
 * - `acquire`：value>0 则 value--；否则入队阻塞。
 * - `release`：若队列非空，唤醒队首并立刻交付一个许可（value 不变，许可从释放者转交被唤醒者）；
 *   否则 value++。
 *
 * 注意：真实语义里 release 唤醒等待者时计数净不变（一个许可从释放线程传给被唤醒线程）。
 */
export class Semaphore {
  private value: number;
  private readonly queue: number[] = [];
  private nextId = 0;
  private readonly hooks: SemaphoreHooks;

  constructor(initial: number, hooks: SemaphoreHooks = {}) {
    this.value = Math.max(0, Math.floor(initial));
    this.hooks = hooks;
  }

  /** 当前许可数。 */
  get count(): number {
    return this.value;
  }

  /** 当前等待队列长度。 */
  get waiting(): number {
    return this.queue.length;
  }

  /** acquire：返回是否立即获得（false 表示已入队阻塞）。threadId 可选，省略则自增分配。 */
  acquire(threadId?: number): boolean {
    const tid = threadId ?? this.nextId++;
    if (this.value > 0) {
      this.value--;
      this.hooks.onAcquire?.(this.value);
      return true;
    }
    this.queue.push(tid);
    this.hooks.onBlock?.(tid);
    return false;
  }

  /** release：归还许可或唤醒一个等待者。返回是否唤醒了某线程。 */
  release(): boolean {
    if (this.queue.length > 0) {
      const woken = this.queue.shift()!;
      // 许可直接转交：计数净不变（一个许可从释放者交付被唤醒者）
      this.hooks.onWake?.(woken, this.value);
      return true;
    }
    this.value++;
    this.hooks.onRelease?.(this.value);
    return false;
  }
}

/**
 * 信号量模拟：按给定事件序列推进，返回每步后的状态。
 *
 * @param initial 初始许可数（>= 0）
 * @param events 事件序列
 * @param hooks 可选事件钩子
 * @returns 每步的状态快照
 */
export function simulateSemaphore(
  initial: number,
  events: SemaphoreEvent[],
  hooks: SemaphoreHooks = {},
): SemaphoreStep[] {
  const sem = new Semaphore(initial, hooks);
  const steps: SemaphoreStep[] = [];
  let autoId = 0;
  for (const ev of events) {
    const tid = ev.threadId ?? autoId++;
    if (ev.type === 'acquire') {
      sem.acquire(tid);
    } else {
      sem.release();
    }
    steps.push({ event: ev.type, value: sem.count, queueSize: sem.waiting });
  }
  return steps;
}
