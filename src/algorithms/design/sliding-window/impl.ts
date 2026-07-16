// =============================================================================
// 滑动窗口（Sliding Window）· 纯算法实现
// 经典问题：最长无重复元素子数组（类比「无重复字符的最长子串」）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露窗口的扩张/收缩，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SlidingWindowHooks {
  /** 窗口右端扩展到 right（含）。给出当前窗口 [left, right]。 */
  onExpand?: (left: number, right: number) => void;
  /** 窗口左端收缩到新 left（因发现重复）。给出收缩后的 [left, right]。 */
  onShrink?: (left: number, right: number) => void;
  /** 发现更长的无重复窗口，更新最优。给出最优窗口 [bestLeft, bestRight] 与长度。 */
  onUpdateBest?: (bestLeft: number, bestRight: number, length: number) => void;
  /** 完成。给出最终最优窗口与长度。 */
  onResult?: (bestLeft: number, bestRight: number, length: number) => void;
}

/** 滑动窗口结果。 */
export interface SlidingWindowResult {
  /** 最长无重复子数组的长度。 */
  length: number;
  /** 最长子数组的起始下标（左闭）。 */
  start: number;
}

/**
 * 求最长无重复元素的子数组长度（类比「无重复字符的最长子串」）。
 *
 * 双指针滑动窗口：
 * - 维护窗口 `[left, right]`，用 Map 记录窗口内每个值最近一次出现的下标。
 * - right 向右扩展，把 a[right] 纳入窗口。
 * - 若 a[right] 已在窗口内（其上次出现下标 >= left），则把 left 跳到
 *   「上次出现下标 + 1」，以剔除重复，保持窗口内元素互异。
 * - 每步用当前窗口长度更新最优。
 *
 * 时间 `O(n)`（每个元素被左右指针各至多访问一次），空间 `O(min(n, U))`（U 为值域）。
 *
 * @param arr 输入数组
 * @param hooks 可选事件钩子
 * @returns 最长无重复子数组的长度与起始下标
 */
export function longestUniqueSubarray(
  arr: readonly number[],
  hooks: SlidingWindowHooks = {},
): SlidingWindowResult {
  const n = arr.length;
  let left = 0;
  let bestLen = 0;
  let bestLeft = 0;
  /** 值 -> 最近一次出现的下标。 */
  const lastSeen = new Map<number, number>();

  for (let right = 0; right < n; right++) {
    const v = arr[right]!;
    if (lastSeen.has(v)) {
      const prev = lastSeen.get(v)!;
      // 仅当重复元素仍在窗口内时才需要收缩
      if (prev >= left) {
        left = prev + 1;
        hooks.onShrink?.(left, right);
      }
    }
    lastSeen.set(v, right);
    hooks.onExpand?.(left, right);

    const len = right - left + 1;
    if (len > bestLen) {
      bestLen = len;
      bestLeft = left;
      hooks.onUpdateBest?.(bestLeft, right, bestLen);
    }
  }

  hooks.onResult?.(bestLeft, bestLeft + bestLen - 1, bestLen);
  return { length: bestLen, start: bestLeft };
}

/** 别名：slidingWindow = longestUniqueSubarray。 */
export function slidingWindow(
  arr: readonly number[],
  hooks: SlidingWindowHooks = {},
): SlidingWindowResult {
  return longestUniqueSubarray(arr, hooks);
}
