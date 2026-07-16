// =============================================================================
// 任务调度器（Task Scheduler, 冷却期版）· 纯算法实现
// 公式法：max(tasks.length, (maxFreq-1)*(n+1) + maxCount)。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface TaskSchedulerCooldownHooks {
  /** 统计完频次。 */
  onCount?: (freq: Array<{ task: string; count: number }>) => void;
  /** 求出 maxFreq 与 maxCount。 */
  onMax?: (maxFreq: number, maxCount: number) => void;
  /** 结论：最短时间。 */
  onConclude?: (time: number) => void;
}

export interface TaskSchedulerResult {
  /** 最短完成时间。 */
  minTime: number;
  /** 最大频次。 */
  maxFreq: number;
  /** 达到最大频次的任务种类数。 */
  maxCount: number;
}

/**
 * 任务调度器（冷却期）：求完成所有任务的最短时间（公式法）。
 *
 * @param tasks 任务数组（每个元素是一个任务标识）
 * @param n 同类任务间的冷却单位
 * @param hooks 可选事件钩子
 */
export function taskSchedulerCooldown(
  tasks: readonly string[],
  n: number,
  hooks: TaskSchedulerCooldownHooks = {},
): TaskSchedulerResult {
  // 频次统计
  const counter = new Map<string, number>();
  for (const t of tasks) counter.set(t, (counter.get(t) ?? 0) + 1);
  const freq = [...counter.entries()]
    .map(([task, count]) => ({ task, count }))
    .sort((a, b) => b.count - a.count);
  hooks.onCount?.(freq);

  const maxFreq = freq.length > 0 ? freq[0]!.count : 0;
  let maxCount = 0;
  for (const f of freq) {
    if (f.count === maxFreq) maxCount++;
    else break;
  }
  hooks.onMax?.(maxFreq, maxCount);

  const bucketTime = (maxFreq - 1) * (n + 1) + maxCount;
  const minTime = Math.max(tasks.length, bucketTime);
  hooks.onConclude?.(minTime);
  return { minTime, maxFreq, maxCount };
}
