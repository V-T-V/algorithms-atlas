// =============================================================================
// Kadane 最大子数组和 · 纯算法实现
// 零 DOM 依赖，可独立单测。O(n) 时间 O(1) 空间。
// 通过「钩子」暴露每步 curMax / globalMax 与最优区间，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface KadaneHooks {
  /** 处理完下标 i：当前 curMax、全局 globalMax。 */
  onStep?: (i: number, curMax: number, globalMax: number) => void;
  /** 发现更优解，更新最优区间。给出 [start, end]（左闭右闭）与和。 */
  onUpdateBest?: (start: number, end: number, maxSum: number) => void;
  /** 完成。给出最终最优区间与和。 */
  onResult?: (start: number, end: number, maxSum: number) => void;
}

/** Kadane 结果：最大和与最优区间。 */
export interface KadaneResult {
  /** 最大子数组和。 */
  maxSum: number;
  /** 最优子数组起始下标（左闭）。 */
  start: number;
  /** 最优子数组结束下标（右闭）。 */
  end: number;
}

/**
 * Kadane 算法：求最大子数组和。
 *
 * - curMax = max(a[i], curMax + a[i])
 * - globalMax = max(globalMax, curMax)
 * - 记录最优区间 [start, end]：curMax 重置时 start = i，globalMax 更新时 end = i。
 *
 * @param arr 输入数组
 * @param hooks 可选事件钩子
 * @returns 最大和与最优区间
 */
export function kadane(arr: readonly number[], hooks: KadaneHooks = {}): KadaneResult {
  const n = arr.length;
  if (n === 0) {
    hooks.onResult?.(-1, -1, 0);
    return { maxSum: 0, start: -1, end: -1 };
  }

  let curMax = arr[0]!;
  let globalMax = arr[0]!;
  let start = 0;
  let end = 0;
  let curStart = 0; // 当前 curMax 区间的起点

  hooks.onStep?.(0, curMax, globalMax);
  hooks.onUpdateBest?.(start, end, globalMax);

  for (let i = 1; i < n; i++) {
    const v = arr[i]!;
    // 若 curMax + v < v（即 curMax < 0），则从 i 重新开始更优
    if (curMax < 0) {
      curMax = v;
      curStart = i;
    } else {
      curMax = curMax + v;
    }
    hooks.onStep?.(i, curMax, globalMax);
    if (curMax > globalMax) {
      globalMax = curMax;
      start = curStart;
      end = i;
      hooks.onUpdateBest?.(start, end, globalMax);
    }
  }

  hooks.onResult?.(start, end, globalMax);
  return { maxSum: globalMax, start, end };
}
