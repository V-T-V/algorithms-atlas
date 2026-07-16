// =============================================================================
// 查找区间（Search Range）· 纯算法实现
// 在升序数组（含重复）中找 target 的首个与末个下标。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SearchRangeHooks {
  /** 在 [lo,hi] 区间探测中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number, phase: 'first' | 'last') => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right', phase: 'first' | 'last') => void;
  /** 计算完成。 */
  onDone?: (first: number, last: number) => void;
}

/** 首个等于 target 的下标。 */
function findFirst(arr: readonly number[], target: number, hooks: SearchRangeHooks): number {
  let lo = 0;
  let hi = arr.length - 1;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid, 'first');
    if (arr[mid]! === target) {
      result = mid;
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left', 'first');
    } else if (arr[mid]! < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right', 'first');
    } else {
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left', 'first');
    }
  }
  return result;
}

/** 末个等于 target 的下标。 */
function findLast(arr: readonly number[], target: number, hooks: SearchRangeHooks): number {
  let lo = 0;
  let hi = arr.length - 1;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid, 'last');
    if (arr[mid]! === target) {
      result = mid;
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right', 'last');
    } else if (arr[mid]! < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right', 'last');
    } else {
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left', 'last');
    }
  }
  return result;
}

/**
 * 找 target 的 [首个, 末个] 下标；不存在返回 [-1, -1]。
 */
export function searchRange(
  arr: readonly number[],
  target: number,
  hooks: SearchRangeHooks = {},
): [number, number] {
  const first = findFirst(arr, target, hooks);
  const last = first < 0 ? -1 : findLast(arr, target, hooks);
  hooks.onDone?.(first, last);
  return [first, last];
}
