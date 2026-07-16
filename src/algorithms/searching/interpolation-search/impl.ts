// =============================================================================
// 插值搜索 Interpolation Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface InterpolationSearchHooks {
  /** 根据线性插值估计的探测点 pos。 */
  onProbe?: (lo: number, hi: number, pos: number) => void;
  /** 区间缩小：dir='left' 去左半、'right' 去右半。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 插值搜索：在**升序且均匀分布**的数组中查找 target，返回其下标；不存在返回 -1。
 *
 * 不取中点，而是按值做**线性插值**估计 target 可能的位置：
 *
 * ```
 * pos = lo + floor( (target - a[lo]) * (hi - lo) / (a[hi] - a[lo]) )
 * ```
 *
 * - 若 `a[pos] === target` 命中
 * - 若 `a[pos] < target` → `lo = pos + 1`
 * - 若 `a[pos] > target` → `hi = pos - 1`
 *
 * 当 `a[lo] === a[hi]`（值恒定）时退化：直接比较 `a[lo]` 与 target 后返回。
 * 必须 `a[lo] <= target <= a[hi]` 才有效，否则 pos 会越界 → 立即判否。
 *
 * 时间：均匀分布时 `O(log log n)`，最坏（分布不均）`O(n)`。空间 `O(1)`。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function interpolationSearch(
  arr: readonly number[],
  target: number,
  hooks: InterpolationSearchHooks = {},
): number {
  const n = arr.length;
  let lo = 0;
  let hi = n - 1;

  while (lo <= hi) {
    const aLo = arr[lo]!;
    const aHi = arr[hi]!;
    // target 必须落在 [aLo, aHi] 内，否则不存在
    if (target < aLo || target > aHi) {
      hooks.onDone?.(-1);
      return -1;
    }
    // 值恒定：避免除零
    if (aLo === aHi) {
      hooks.onProbe?.(lo, hi, lo);
      if (aLo === target) {
        hooks.onDone?.(lo);
        return lo;
      }
      hooks.onDone?.(-1);
      return -1;
    }
    // 线性插值
    const pos = lo + Math.floor(((target - aLo) * (hi - lo)) / (aHi - aLo));
    const safePos = Math.max(lo, Math.min(hi, pos));
    hooks.onProbe?.(lo, hi, safePos);
    const v = arr[safePos]!;
    if (v === target) {
      hooks.onDone?.(safePos);
      return safePos;
    }
    if (v < target) {
      lo = safePos + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = safePos - 1;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(-1);
  return -1;
}
