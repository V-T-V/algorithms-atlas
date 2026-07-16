// =============================================================================
// 耐心排序 Patience Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PatienceSortHooks {
  /** 把 v 放到牌堆 pileIndex 的顶端（新建堆时 pileIndex = 新堆下标）。 */
  onPlace?: (v: number, pileIndex: number) => void;
  /** 从所有牌堆顶取最小值，附加到输出。 */
  onMergePick?: (v: number, pileIndex: number) => void;
}

/**
 * 耐心排序（Patience Sort）。
 *
 * 原理：模仿单人纸牌游戏 *Patience*。
 * - 顺序扫描每个元素，把它放到**最左边的、堆顶 ≥ 该元素**的牌堆上（保持堆顶递增）；
 *   若没有合适堆，则新建一个堆
 * - 所有元素归堆后，每个堆顶元素自顶向下递增；用一个小顶堆（这里用线性取最小）反复
 *   取出所有堆顶的最小值，附加到结果序列
 *
 * 牌堆个数恰为输入的**最长递增子序列（LIS）长度**。
 *
 * - 时间 `O(n log n)`（用堆合并；本实现合并阶段为 `O(n·k)`，k 为堆数，便于教学）
 * - 空间 `O(n)`
 * - 稳定性：**稳定**
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function patienceSort(arr: readonly number[], hooks: PatienceSortHooks = {}): number[] {
  const piles: number[][] = []; // 每个堆：piles[i][末尾] 为堆顶
  // 记录每个元素被放到哪个堆，供 trace 使用（同值稳定：选最左可放堆）

  for (const v of arr) {
    // 二分找最左边「堆顶 >= v」的堆
    let lo = 0;
    let hi = piles.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const top = piles[mid]![piles[mid]!.length - 1]!;
      if (top < v) lo = mid + 1;
      else hi = mid; // top >= v → 可以放在 mid 上，继续向左找更左的
    }
    if (lo === piles.length) piles.push([]);
    piles[lo]!.push(v);
    hooks.onPlace?.(v, lo);
  }

  // 合并阶段：反复取所有堆顶的最小值
  const result: number[] = [];
  const remaining = piles.map((p) => p.length); // 每堆剩余元素数；栈底在 0
  const total = arr.length;
  for (let k = 0; k < total; k++) {
    let bestIdx = -1;
    let bestVal = Infinity;
    for (let i = 0; i < piles.length; i++) {
      const len = remaining[i]!;
      if (len === 0) continue;
      const top = piles[i]![len - 1]!; // 栈顶
      if (top < bestVal) {
        bestVal = top;
        bestIdx = i;
      }
    }
    result.push(bestVal);
    remaining[bestIdx]!--;
    hooks.onMergePick?.(bestVal, bestIdx);
  }
  return result;
}
