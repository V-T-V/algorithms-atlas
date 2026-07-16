// =============================================================================
// 屏障（Cyclic Barrier）· 纯算法实现（事件序列模拟）
// 零 DOM 依赖，可独立单测。n 个线程到达后统一放行并重置，可循环复用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BarrierHooks {
  /** 线程 threadId 到达屏障（尚未放行）。给出已到达数与总数。 */
  onArrive?: (threadId: number, arrived: number, total: number) => void;
  /** 屏障放行（第 n 个线程到达，触发整体释放）。给出本「代」generation。 */
  onRelease?: (generation: number) => void;
  /** 屏障已重置，开始新的一代。给出新 generation。 */
  onReset?: (generation: number) => void;
}

/**
 * 循环屏障（事件序列模拟版）。
 *
 * - `await()`：arrived++。返回 true 表示调用者是「最后到达者」（第 n 个），此时触发放行：计数归零、generation++，屏障可复用。
 * - 返回 false 表示需继续等待（在真实实现中线程会阻塞，模拟里仅记录）。
 *
 * @param parties 屏障所需线程数（>= 1）
 * @param hooks 可选事件钩子
 */
export class Barrier {
  private readonly parties: number;
  private arrived: number;
  private generation: number;
  private readonly hooks: BarrierHooks;

  constructor(parties: number, hooks: BarrierHooks = {}) {
    this.parties = Math.max(1, Math.floor(parties));
    this.arrived = 0;
    this.generation = 0;
    this.hooks = hooks;
  }

  /** 屏障所需线程数。 */
  get total(): number {
    return this.parties;
  }

  /** 当前已到达数（归零后表示新的一代已开始）。 */
  get waiting(): number {
    return this.arrived;
  }

  /** 当前代（每次放行后 +1）。 */
  get gen(): number {
    return this.generation;
  }

  /** 线程到达屏障。返回是否为最后到达者（触发放行）。 */
  await(threadId: number): boolean {
    this.arrived++;
    this.hooks.onArrive?.(threadId, this.arrived, this.parties);
    if (this.arrived >= this.parties) {
      this.hooks.onRelease?.(this.generation);
      this.arrived = 0;
      this.generation++;
      this.hooks.onReset?.(this.generation);
      return true;
    }
    return false;
  }
}

/** 单个到达事件。 */
export interface BarrierEvent {
  /** 到达的线程 id。 */
  threadId: number;
}

/** 模拟结果：每个事件后的状态快照。 */
export interface BarrierStep {
  /** 触发本步的线程 id。 */
  threadId: number;
  /** 处理后已到达数（放行后归零）。 */
  arrived: number;
  /** 处理后所属代（放行后 +1）。 */
  generation: number;
  /** 本步是否触发放行。 */
  released: boolean;
}

/**
 * 屏障模拟：按给定线程到达序列推进。
 *
 * @param parties 所需线程数
 * @param events 到达事件序列
 * @param hooks 可选事件钩子
 * @returns 每步状态快照
 */
export function simulateBarrier(
  parties: number,
  events: BarrierEvent[],
  hooks: BarrierHooks = {},
): BarrierStep[] {
  const barrier = new Barrier(parties, hooks);
  const steps: BarrierStep[] = [];
  for (const ev of events) {
    const released = barrier.await(ev.threadId);
    steps.push({
      threadId: ev.threadId,
      arrived: barrier.waiting,
      generation: barrier.gen,
      released,
    });
  }
  return steps;
}
