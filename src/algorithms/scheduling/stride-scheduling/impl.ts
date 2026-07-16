// =============================================================================
// 步幅调度（Stride Scheduling）· 纯算法实现
// 每进程 stride=K/weight，每次选 passes 最小者运行并累加。零 DOM 依赖，可独立单测。
// =============================================================================

export interface StrideTask {
  id: string;
  /** 权重（>0）。 */
  weight: number;
}

export interface StrideStep {
  /** 本步被选中的进程 id。 */
  id: string;
  /** 选中前的 passes 值。 */
  passesBefore: number;
  /** 运行后累加的 passes 值。 */
  passesAfter: number;
}

export interface StrideResult {
  /** 调度步骤序列。 */
  steps: StrideStep[];
  /** 各进程被选次数。 */
  picks: Map<string, number>;
  /** 各进程最终 passes 值。 */
  finalPasses: Map<string, number>;
}

export interface StrideHooks {
  /** 每步选出某进程运行。 */
  onPick?: (id: string, passesBefore: number, passesAfter: number) => void;
}

/**
 * 步幅调度。
 *
 * @param tasks 任务列表（含权重）
 * @param steps 要运行的步数
 * @param hooks 可选钩子
 * @returns 调度结果（步骤序列 + 各进程统计）
 */
export function strideScheduling(
  tasks: readonly StrideTask[],
  steps: number,
  hooks: StrideHooks = {},
): StrideResult {
  if (tasks.length === 0 || steps <= 0) {
    return { steps: [], picks: new Map(), finalPasses: new Map() };
  }

  // K = 所有权重的最小公倍数的近似 → 用大常数保证整数步幅
  // 这里取 K = (所有 weight 的乘积)，确保 stride = K/weight 为整数
  const weights = tasks.map((t) => Math.max(1, Math.floor(t.weight)));
  const K = weights.reduce((p, w) => p * w, 1);

  const stride = new Map<string, number>();
  const passes = new Map<string, number>();
  const picks = new Map<string, number>();
  for (const t of tasks) {
    const w = Math.max(1, Math.floor(t.weight));
    stride.set(t.id, K / w);
    passes.set(t.id, 0);
    picks.set(t.id, 0);
  }

  const stepList: StrideStep[] = [];
  for (let i = 0; i < steps; i++) {
    // 选 passes 最小者（平局取 id 字典序最小，保证确定性）
    let bestId: string | null = null;
    let bestPasses = Infinity;
    for (const t of tasks) {
      const p = passes.get(t.id)!;
      if (p < bestPasses || (p === bestPasses && (bestId === null || t.id < bestId))) {
        bestPasses = p;
        bestId = t.id;
      }
    }
    if (bestId === null) break;
    const id = bestId;
    const before = passes.get(id)!;
    const s = stride.get(id)!;
    const after = before + s;
    passes.set(id, after);
    picks.set(id, (picks.get(id) ?? 0) + 1);
    stepList.push({ id, passesBefore: before, passesAfter: after });
    hooks.onPick?.(id, before, after);
  }

  return { steps: stepList, picks, finalPasses: passes };
}
