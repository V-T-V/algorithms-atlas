// =============================================================================
// 作业调度（Job Sequencing）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 有截止时间的作业调度：每个作业有利润 p 和截止时间 d，每个时间槽只能做一个作业。
// =============================================================================

/** 作业。 */
export interface Job {
  id: string;
  deadline: number;
  profit: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface JobSeqHooks {
  onSort?: (order: number[]) => void;
  onSchedule?: (jobIdx: number, slot: number) => void;
  onResult?: (profit: number) => void;
}

export interface JobSeqResult {
  /** 调度方案：slot[slotIdx] = 作业原始下标（未占用为 -1）。 */
  slots: number[];
  /** 总利润。 */
  profit: number;
}

/**
 * 作业调度（带截止时间的利润最大化）：
 * 按利润降序，每个作业尽量放到 ≤ deadline 的最晚空闲槽（贪心保序）。
 * @param jobs 作业列表
 * @param hooks 可选的事件钩子
 */
export function jobSeq(jobs: Job[], hooks: JobSeqHooks = {}): JobSeqResult {
  const order = jobs.map((j, i) => ({ i, ...j })).sort((a, b) => b.profit - a.profit);
  hooks.onSort?.(order.map((o) => o.i));

  const maxDeadline = jobs.reduce((m, j) => Math.max(m, j.deadline), 0);
  const slots = new Array<number>(maxDeadline).fill(-1);
  let profit = 0;

  for (const o of order) {
    // 找 ≤ deadline-1 的最晚空闲槽
    for (let s = Math.min(o.deadline, maxDeadline) - 1; s >= 0; s--) {
      if (slots[s] === -1) {
        slots[s] = o.i;
        profit += o.profit;
        hooks.onSchedule?.(o.i, s);
        break;
      }
    }
  }
  hooks.onResult?.(profit);
  return { slots, profit };
}
