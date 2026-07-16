// =============================================================================
// Moore-Hodgson（最小化延迟作业数）· 纯算法实现
// 按截止时间排序 + 最大堆，超时剔除最长作业。零 DOM 依赖，可独立单测。
// =============================================================================

export interface MhJob {
  id: string;
  /** 处理时间（>0）。 */
  processing: number;
  /** 截止时间（>=0）。 */
  deadline: number;
}

export interface MhResult {
  /** 按时完成的作业序列（按截止时间顺序）。 */
  onTime: MhJob[];
  /** 延迟的作业列表。 */
  late: MhJob[];
  /** 延迟作业数 = late.length。 */
  lateCount: number;
}

export interface MhHooks {
  /** 按截止时间排序完成。 */
  onSort?: (sorted: MhJob[]) => void;
  /** 把作业 j 加入按时集合（累计时间 t）。 */
  onAdd?: (job: MhJob, t: number) => void;
  /** 检测到延迟，剔除按时集合中处理时间最大的作业（计入延迟）。 */
  onEvict?: (evicted: MhJob, t: number) => void;
  /** 算法结束。 */
  onDone?: (result: MhResult) => void;
}

/**
 * Moore-Hodgson 最小化延迟作业数。
 *
 * @param jobs 作业列表
 * @param hooks 可选钩子
 * @returns {onTime, late, lateCount}
 */
export function mooreHodgson(jobs: readonly MhJob[], hooks: MhHooks = {}): MhResult {
  if (jobs.length === 0) {
    const r: MhResult = { onTime: [], late: [], lateCount: 0 };
    hooks.onDone?.(r);
    return r;
  }
  // 1. 按截止时间升序
  const sorted = [...jobs].sort((a, b) => a.deadline - b.deadline || a.id.localeCompare(b.id));
  hooks.onSort?.(sorted);

  // 2. 用数组模拟最大堆（按 processing）—— 简化为排序数组每次取最大
  const onTime: MhJob[] = [];
  const late: MhJob[] = [];
  let t = 0;

  for (const j of sorted) {
    onTime.push(j);
    t += j.processing;
    hooks.onAdd?.(j, t);
    if (t > j.deadline) {
      // 剔除处理时间最大者
      let maxIdx = 0;
      for (let i = 1; i < onTime.length; i++) {
        if (onTime[i]!.processing > onTime[maxIdx]!.processing) maxIdx = i;
      }
      const evicted = onTime.splice(maxIdx, 1)[0]!;
      t -= evicted.processing;
      late.push(evicted);
      hooks.onEvict?.(evicted, t);
    }
  }

  const result: MhResult = { onTime, late, lateCount: late.length };
  hooks.onDone?.(result);
  return result;
}
