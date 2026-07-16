// =============================================================================
// 集合覆盖（Set Cover，贪心近似）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SetCoverHooks {
  onPick?: (subsetIdx: number, newCovered: number) => void;
  onResult?: (chosen: number[]) => void;
}

export interface SetCoverResult {
  /** 被选中的子集原始下标。 */
  chosen: number[];
}

/**
 * 集合覆盖（贪心近似，log 近似比）：从一族子集中选最少个子集覆盖全集 U。
 *
 * 每轮贪心选取「能新覆盖最多未覆盖元素」的子集，直到覆盖完。
 * @param subsets 子集数组（每个是元素列表）
 * @param universe 全集
 * @param hooks 可选的事件钩子
 */
export function setCover<T>(
  subsets: T[][],
  universe: T[],
  hooks: SetCoverHooks = {},
): SetCoverResult {
  const need = new Set(universe);
  const chosen: number[] = [];
  const used = new Array<boolean>(subsets.length).fill(false);

  while (need.size > 0) {
    let best = -1;
    let bestGain = 0;
    for (let i = 0; i < subsets.length; i++) {
      if (used[i]) continue;
      let gain = 0;
      for (const e of subsets[i]!) if (need.has(e)) gain++;
      if (gain > bestGain) {
        bestGain = gain;
        best = i;
      }
    }
    if (best === -1 || bestGain === 0) break; // 无法继续覆盖
    used[best] = true;
    chosen.push(best);
    for (const e of subsets[best]!) need.delete(e);
    hooks.onPick?.(best, bestGain);
  }
  hooks.onResult?.(chosen);
  return { chosen: need.size === 0 ? chosen : chosen };
}
