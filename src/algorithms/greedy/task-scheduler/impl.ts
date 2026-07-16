// =============================================================================
// 任务调度器（Task Scheduler）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TaskSchedulerHooks {
  onFrame?: (time: number, task: string) => void;
  onResult?: (total: number) => void;
}

export interface TaskSchedulerResult {
  /** 完成所有任务所需的最少时间片数。 */
  total: number;
}

/**
 * 任务调度器（LeetCode 621）：相同任务两次执行间至少间隔 n 个时间片，求最少总时间。
 *
 * 贪心公式：设最高频任务执行 maxExec 次，则有 (maxExec−1) 个冷却块，每块 n+1 长，
 * 末尾接出现 maxExec 次的任务个数。取 max(任务总数, 公式值)。
 * @param tasks 任务标签数组
 * @param n 冷却间隔
 * @param hooks 可选的事件钩子
 */
export function taskScheduler(
  tasks: string[],
  n: number,
  hooks: TaskSchedulerHooks = {},
): TaskSchedulerResult {
  const freq = new Map<string, number>();
  for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);
  const execs = [...freq.values()].sort((a, b) => b - a);
  const maxExec = execs[0] ?? 0;
  let countMax = 0;
  for (const e of execs) if (e === maxExec) countMax++;
  const formula = (maxExec - 1) * (n + 1) + countMax;
  const total = Math.max(tasks.length, formula);
  hooks.onResult?.(total);
  void hooks.onFrame; // 帧钩子保留接口
  return { total };
}
