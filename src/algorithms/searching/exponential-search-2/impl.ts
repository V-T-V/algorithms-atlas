// =============================================================================
// 指数搜索变体 Galloping Search (Exponential Search for Lower Bound) · 纯算法实现
// 标准指数搜索求「精确匹配」的变体：求「下界」lower_bound —— 第一个 ≥ target 的位置。
// 用 galloping（倍增）快速定位区间，再做二分。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GallopingSearchHooks {
  /** 倍增探测：bound 翻倍，当前检查到 a[min(bound,n)-1]。 */
  onGallops?: (bound: number, value: number) => void;
  /** 倍增阶段结束，定位到二分区间 [lo, hi]。 */
  onRange?: (lo: number, hi: number) => void;
  /** 二分阶段每次取中点比较。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 查找结束：给出下界位置（可能为 n，表示 target 大于所有元素）。 */
  onDone?: (lowerBound: number, exact: boolean) => void;
}

/**
 * Galloping 搜索（指数搜索求下界）：返回**升序**数组中第一个 `≥ target` 的元素下标。
 *
 * 与标准指数搜索的区别：本变体不是「找精确匹配」，而是找 **lower_bound**（插入点），
 * 同时通过比较下界处的值与 target 判定是否精确命中。
 *
 * 流程：\n
 * 1. 特判：若 `a[0] >= target`，下界为 0\n
 * 2. **倍增（galloping）**：`bound` 从 1 起，每次翻倍，直到 `a[min(bound,n)-1] >= target` 或越界\n
 *    —— 此时 target 必落在 `[bound/2, min(bound, n))` 内\n
 * 3. **二分**：在上述区间内做 lower_bound 二分\n
 *
 * 时间：`O(log k)`，其中 k 为下界位置（倍增 `O(log k)` + 二分 `O(log k)`）；
 * 当目标偏小、数组极长或「无界」（流式 / 磁盘）时尤为高效——只需访问 `O(log k)` 个元素。
 * 空间 `O(1)`。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选事件钩子
 * @returns `{ index, exact }`：index 为下界（0..n），exact 表示 a[index]===target
 */
export function gallopingSearch(
  arr: readonly number[],
  target: number,
  hooks: GallopingSearchHooks = {},
): { index: number; exact: boolean } {
  const n = arr.length;

  // 特判首元素
  if (n === 0 || arr[0]! >= target) {
    const exact = n > 0 && arr[0] === target;
    hooks.onRange?.(0, 0);
    hooks.onDone?.(0, exact);
    return { index: 0, exact };
  }

  // 倍增找区间
  let bound = 1;
  while (bound < n && arr[Math.min(bound, n) - 1]! < target) {
    hooks.onGallops?.(bound, arr[Math.min(bound, n) - 1]!);
    bound *= 2;
  }
  const hi = Math.min(bound, n);
  const lo = Math.floor(bound / 2);
  hooks.onRange?.(lo, hi - 1);

  // 二分求下界：在 [lo, hi) 内找第一个 >= target
  let l = lo;
  let r = hi;
  while (l < r) {
    const mid = (l + r) >> 1;
    hooks.onProbe?.(l, r - 1, mid);
    if (arr[mid]! < target) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  const index = l; // l == r，是下界；可能为 n
  const exact = index < n && arr[index] === target;
  hooks.onDone?.(index, exact);
  return { index, exact };
}

/** 兼容旧导出名。 */
export const exponentialSearch2 = gallopingSearch;
