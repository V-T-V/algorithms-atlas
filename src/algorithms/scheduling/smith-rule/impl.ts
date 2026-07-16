// Smith 规则（WSPT）· 纯算法实现

export interface SrJob {
  id: string;
  processing: number; // p_j
  weight: number; // w_j
}

export interface SrScheduled extends SrJob {
  /** 比率 wj/pj。 */
  ratio: number;
  /** 完工时刻 Cj。 */
  completion: number;
  /** 加权贡献 wj·Cj。 */
  weightedCompletion: number;
}

export interface SrResult {
  schedule: SrScheduled[];
  /** ΣwjCj。 */
  totalWeightedCompletion: number;
  /** 顺序（id 序列）。 */
  order: string[];
}

/** 事件钩子。 */
export interface SrHooks {
  /** 排序完成（给出顺序与各比率）。 */
  onSort?: (order: string[], ratios: Array<{ id: string; ratio: number }>) => void;
  /** 某作业完成。 */
  onComplete?: (sched: SrScheduled) => void;
  /** 最终目标值。 */
  onResult?: (total: number) => void;
}

/**
 * Smith 规则（WSPT）：按 wj/pj 降序最小化 ΣwjCj。
 *
 * 平局（同比率）按 id 字典序，确保确定性。
 *
 * @param jobs 作业列表（处理时间与权重均 >0）
 * @param hooks 可选事件钩子
 */
export function smithRule(jobs: readonly SrJob[], hooks: SrHooks = {}): SrResult {
  if (jobs.length === 0) return { schedule: [], totalWeightedCompletion: 0, order: [] };
  for (const j of jobs) {
    if (j.processing <= 0) throw new RangeError(`处理时间须为正: ${j.id}`);
    if (j.weight <= 0) throw new RangeError(`权重须为正: ${j.id}`);
  }

  const ratios = jobs.map((j) => ({ id: j.id, ratio: j.weight / j.processing, job: j }));
  // 按 ratio 降序，平局按 id
  ratios.sort((a, b) => b.ratio - a.ratio || a.id.localeCompare(b.id));
  hooks.onSort?.(
    ratios.map((r) => r.id),
    ratios.map((r) => ({ id: r.id, ratio: r.ratio })),
  );

  let now = 0;
  let total = 0;
  const schedule: SrScheduled[] = [];
  for (const r of ratios) {
    now += r.job.processing;
    const wc = r.job.weight * now;
    total += wc;
    const s: SrScheduled = {
      ...r.job,
      ratio: r.ratio,
      completion: now,
      weightedCompletion: wc,
    };
    schedule.push(s);
    hooks.onComplete?.(s);
  }
  hooks.onResult?.(total);
  return { schedule, totalWeightedCompletion: total, order: schedule.map((s) => s.id) };
}
