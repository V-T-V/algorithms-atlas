// 最大-最小公平分配（Max-Min Fairness）· 纯算法实现
// 渐进式填充（progressive filling）。

export interface MmfParty {
  id: string;
  demand: number; // 需求上界（>0）
}

export interface MmfAllocation {
  id: string;
  demand: number;
  allocated: number;
  saturated: boolean;
}

export interface MmfResult {
  allocations: MmfAllocation[];
  /** 总容量。 */
  capacity: number;
  /** 实际分配总和（= min(capacity, Σdemand)）。 */
  totalAllocated: number;
  /** 是否有未饱和方（容量有富余时为 false）。 */
  allSaturated: boolean;
}

/** 事件钩子。 */
export interface MmfHooks {
  /** 一轮均分：给出本轮起始分配率 level、本轮结束后剩余容量。 */
  onRound?: (round: number, level: number, remainingCapacity: number, activeCount: number) => void;
  /** 某方被饱和（达到其需求）。 */
  onSaturate?: (party: MmfAllocation) => void;
  /** 完成。 */
  onResult?: (result: MmfResult) => void;
}

/**
 * 最大-最小公平分配（progressive filling）。
 *
 * @param parties 各方需求
 * @param capacity 总容量
 * @param hooks 可选事件钩子
 */
export function maxMinFairness(
  parties: readonly MmfParty[],
  capacity: number,
  hooks: MmfHooks = {},
): MmfResult {
  const n = parties.length;
  if (n === 0) return { allocations: [], capacity, totalAllocated: 0, allSaturated: true };

  const allocs: MmfAllocation[] = parties.map((p) => ({
    id: p.id,
    demand: p.demand,
    allocated: 0,
    saturated: p.demand <= 0,
  }));

  let remaining = capacity;
  let round = 0;

  while (remaining > 0) {
    const active = allocs.filter((a) => !a.saturated);
    if (active.length === 0) break;
    // 找出本轮先把谁饱和：每个 active 方到饱和还差 gap，最小 gap 对应方先饱和
    // 本轮 level 增加 x，使得 min(gap)/active 或 remaining/active 命中
    const gaps = active.map((a) => a.demand - a.allocated);
    const minGap = Math.min(...gaps);
    const shareIfAllEqual = remaining / active.length;

    const level = Math.min(minGap, shareIfAllEqual);
    if (level <= 0) break;

    for (const a of active) {
      a.allocated += level;
      remaining -= level;
    }
    round++;
    hooks.onRound?.(round, level, remaining, active.length);

    // 标记新饱和的
    for (const a of active) {
      if (a.allocated >= a.demand - 1e-9) {
        a.allocated = a.demand; // 防浮点
        a.saturated = true;
        hooks.onSaturate?.(a);
      }
    }
  }

  const totalAllocated = allocs.reduce((s, a) => s + a.allocated, 0);
  const allSaturated = allocs.every((a) => a.saturated);
  const result: MmfResult = {
    allocations: allocs,
    capacity,
    totalAllocated,
    allSaturated,
  };
  hooks.onResult?.(result);
  return result;
}
