// 带截止期限的作业排序（贪心）· 纯算法实现

export interface JdJob {
  id: string;
  deadline: number; // d_j（>=1）
  profit: number; // p_j
}

export interface JdSlot {
  slot: number; // 时间槽（1-based）
  jobId: string;
  profit: number;
}

export interface JdResult {
  /** 选中的作业及其时间槽。 */
  slots: JdSlot[];
  /** 选中的作业 id。 */
  selected: string[];
  /** 被跳过的作业 id。 */
  skipped: string[];
  /** 最大利润。 */
  totalProfit: number;
}

/** 事件钩子。 */
export interface JdHooks {
  /** 考虑作业 j（给出利润与截止期）。 */
  onConsider?: (job: JdJob) => void;
  /** 作业被放入某时间槽。 */
  onSchedule?: (slot: number, job: JdJob) => void;
  /** 作业无法安排被跳过。 */
  onSkip?: (job: JdJob) => void;
  /** 完成。 */
  onResult?: (totalProfit: number) => void;
}

/**
 * 贪心：按利润降序，每个作业放 ≤ dj 的最晚空闲槽。
 *
 * @param jobs 作业列表
 * @param hooks 可选事件钩子
 */
export function jobSequencingDeadline(jobs: readonly JdJob[], hooks: JdHooks = {}): JdResult {
  if (jobs.length === 0) return { slots: [], selected: [], skipped: [], totalProfit: 0 };
  for (const j of jobs) {
    if (j.deadline < 1) throw new RangeError(`截止期须 >=1: ${j.id}`);
  }

  // 最大截止期决定槽数
  const maxD = Math.max(...jobs.map((j) => j.deadline));
  // 槽 1..maxD，空为 null
  const slots: Array<JdSlot | null> = new Array(maxD + 1).fill(null); // 1-based

  // 按利润降序（平局按 id）
  const order = [...jobs].sort((a, b) => b.profit - a.profit || a.id.localeCompare(b.id));

  const selected: string[] = [];
  const skipped: string[] = [];
  let totalProfit = 0;

  for (const job of order) {
    hooks.onConsider?.(job);
    // 找 ≤ deadline 的最晚空闲槽
    let placed = -1;
    for (let s = Math.min(job.deadline, maxD); s >= 1; s--) {
      if (slots[s] === null) {
        placed = s;
        break;
      }
    }
    if (placed > 0) {
      slots[placed] = { slot: placed, jobId: job.id, profit: job.profit };
      selected.push(job.id);
      totalProfit += job.profit;
      hooks.onSchedule?.(placed, job);
    } else {
      skipped.push(job.id);
      hooks.onSkip?.(job);
    }
  }

  hooks.onResult?.(totalProfit);
  const result: JdSlot[] = [];
  for (let s = 1; s <= maxD; s++) {
    if (slots[s]) result.push(slots[s]!);
  }
  return { slots: result, selected, skipped, totalProfit };
}
