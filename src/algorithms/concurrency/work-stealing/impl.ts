// =============================================================================
// 工作窃取（Work-Stealing）· 纯算法实现（事件序列模拟）
// N 个 worker 各持双端队列：本地 push/pop（头部），空闲时从他人尾部 steal。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface WsEvent {
  /** 'push' worker 产生新任务（值=任务 id）；'pop' worker 取本地任务；'steal' worker 偷他人任务。 */
  type: 'push' | 'pop' | 'steal';
  /** 发起 worker id（0..nWorkers-1）。 */
  worker: number;
  /** 任务标识（仅 push 用）。 */
  taskId?: number;
}

export interface WsHooks {
  /** worker push 一个任务到本地头部。 */
  onPush?: (worker: number, taskId: number, dequeSize: number) => void;
  /** worker pop 本地头部任务（成功）。 */
  onPop?: (worker: number, taskId: number, dequeSize: number) => void;
  /** worker 本地空，尝试 steal。给出受害 worker 与是否成功（及偷到的任务）。 */
  onSteal?: (worker: number, victim: number, success: boolean, taskId?: number) => void;
  /** worker 本地空且无可偷（所有队列都空）。 */
  onIdle?: (worker: number) => void;
}

export interface WsStats {
  /** push 总次数。 */
  pushes: number;
  /** pop 成功次数。 */
  pops: number;
  /** steal 尝试次数。 */
  stealAttempts: number;
  /** steal 成功次数。 */
  stealSuccesses: number;
}

/** 一个 worker 的双端队列。 */
export class WsDeque {
  // 用数组模拟：头部 = 末尾索引（push/pop 在末尾，O(1)），尾部 = 开头索引（steal 在开头，O(1) 移动指针）
  private items: number[] = [];
  private stealIdx = 0; // 尾部指针（下一个被 steal 的位置）

  push(taskId: number): void {
    this.items.push(taskId);
  }

  /** 本地 pop（头部）。返回 undefined 表示空。 */
  pop(): number | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length - 1 < this.stealIdx) return undefined;
    return this.items.pop();
  }

  /** 被他人 steal（尾部）。返回 undefined 表示空。 */
  steal(): number | undefined {
    if (this.stealIdx >= this.items.length) return undefined;
    const t = this.items[this.stealIdx]!;
    this.stealIdx++;
    return t;
  }

  get size(): number {
    return Math.max(0, this.items.length - this.stealIdx);
  }

  snapshot(): number[] {
    return this.items.slice(this.stealIdx);
  }
}

/**
 * 工作窃取模拟。
 *
 * @param nWorkers worker 数
 * @param events 事件序列
 * @param hooks 可选钩子
 * @returns {deques, stats} 最终各 worker 队列快照与统计
 */
export function simulateWorkStealing(
  nWorkers: number,
  events: WsEvent[],
  hooks: WsHooks = {},
): { deques: number[][]; stats: WsStats } {
  const deques: WsDeque[] = Array.from({ length: nWorkers }, () => new WsDeque());
  const stats: WsStats = { pushes: 0, pops: 0, stealAttempts: 0, stealSuccesses: 0 };
  let stealCursor = 0; // 轮转选择受害者的游标

  for (const ev of events) {
    const w = ev.worker;
    const dq = deques[w]!;
    if (ev.type === 'push') {
      const tid = ev.taskId ?? 0;
      dq.push(tid);
      stats.pushes++;
      hooks.onPush?.(w, tid, dq.size);
    } else if (ev.type === 'pop') {
      const tid = dq.pop();
      if (tid !== undefined) {
        stats.pops++;
        hooks.onPop?.(w, tid, dq.size);
      } else {
        hooks.onIdle?.(w);
      }
    } else {
      // steal：轮转选择一个非自身的 worker
      stats.stealAttempts++;
      let stolen: { victim: number; tid: number } | null = null;
      const start = stealCursor;
      stealCursor = (stealCursor + 1) % nWorkers;
      for (let k = 0; k < nWorkers; k++) {
        const victim = (start + k) % nWorkers;
        if (victim === w) continue;
        const tid = deques[victim]!.steal();
        if (tid !== undefined) {
          stolen = { victim, tid };
          break;
        }
      }
      if (stolen) {
        stats.stealSuccesses++;
        // 偷到的任务立即"执行"（不入自己队列，模拟直接处理）
        hooks.onSteal?.(w, stolen.victim, true, stolen.tid);
      } else {
        hooks.onSteal?.(w, -1, false);
      }
    }
  }

  return { deques: deques.map((d) => d.snapshot()), stats };
}
