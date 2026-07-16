// =============================================================================
// 搜索插入位置（Search Insert Position）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

export interface InsertPos {
  pos: number; // 首个 ≥ target 的下标（lower bound），范围 [0, n]
  exists: boolean; // arr[pos] === target
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface InsertPosHooks {
  /** 在 [lo,hi) 区间探测中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩方向。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 完成。 */
  onDone?: (result: InsertPos) => void;
}

/**
 * 搜索插入位置：返回 target 应插入的下标与是否已存在。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function searchInsertPos(
  arr: readonly number[],
  target: number,
  hooks: InsertPosHooks = {},
): InsertPos {
  const n = arr.length;
  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid);
    if (arr[mid]! < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = mid;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  const exists = lo < n && arr[lo] === target;
  const res: InsertPos = { pos: lo, exists };
  hooks.onDone?.(res);
  return res;
}
