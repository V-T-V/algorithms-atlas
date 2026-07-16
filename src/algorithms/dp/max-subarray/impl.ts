// =============================================================================
// 最大子段和（Maximum Subarray, Kadane）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 求连续子数组的最大和（允许空子段时返回 0 与负数较大者；这里采用「至少含一元素」语义）。
// =============================================================================

/** 最大子段和执行过程中的事件钩子。任一可选。 */
export interface MaxSubarrayHooks {
  /** 开始处理下标 i。 */
  onStep?: (i: number, x: number) => void;
  /** i 处的局部最优更新：cur 为以 i 结尾的最大子段和；reset 表示是否在此处重新开始（丢弃前段）。 */
  onUpdate?: (i: number, cur: number, reset: boolean) => void;
  /** 全局最优被刷新：best 为新的最大子段和，区间为 [start, end]。 */
  onImprove?: (best: number, start: number, end: number) => void;
  /** 算法完成：最大和、起止下标、子段。 */
  onDone?: (best: number, start: number, end: number, subarray: number[]) => void;
}

/** 最大子段和结果。 */
export interface MaxSubarrayResult {
  /** 最大子段和（至少含一元素；空数组返回 0）。 */
  best: number;
  /** 起始下标（含）。 */
  start: number;
  /** 结束下标（含）。 */
  end: number;
  /** 最优子段本身。 */
  subarray: number[];
}

/**
 * Kadane 算法求最大子段和。
 *
 * 思路：维护「以 i 结尾的最大子段和」`cur` 与「全局最优」`best`。
 *   `cur = max(x, cur + x)`（要么从 i 重新开始，要么接续前段）。
 *
 * @param arr 输入数组
 * @param hooks 可选事件钩子
 * @returns 最大和、起止下标、子段
 */
export function maxSubarray(
  arr: readonly number[],
  hooks: MaxSubarrayHooks = {},
): MaxSubarrayResult {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(0, -1, -1, []);
    return { best: 0, start: -1, end: -1, subarray: [] };
  }

  let cur = arr[0]!;
  let curStart = 0;
  let best = arr[0]!;
  let bestStart = 0;
  let bestEnd = 0;
  hooks.onStep?.(0, arr[0]!);
  hooks.onUpdate?.(0, cur, false);
  hooks.onImprove?.(best, bestStart, bestEnd);

  for (let i = 1; i < n; i++) {
    const x = arr[i]!;
    hooks.onStep?.(i, x);
    const reset = cur + x < x;
    if (reset) {
      cur = x;
      curStart = i;
    } else {
      cur = cur + x;
    }
    hooks.onUpdate?.(i, cur, reset);
    if (cur > best) {
      best = cur;
      bestStart = curStart;
      bestEnd = i;
      hooks.onImprove?.(best, bestStart, bestEnd);
    }
  }

  const subarray = arr.slice(bestStart, bestEnd + 1);
  hooks.onDone?.(best, bestStart, bestEnd, subarray);
  return { best, start: bestStart, end: bestEnd, subarray };
}
