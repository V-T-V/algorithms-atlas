// =============================================================================
// 跳跃查找 / 指数跳跃（Gallop / Exponential Jump）· 纯算法实现
// 先以 1,2,4,8,... 的步长「跳跃」定位包含 target 的区间，再在该区间二分。
// 适用于无界/稀疏有序数组。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GallopSearchHooks {
  /** 跳跃到位置 pos（指数扩张阶段）。 */
  onJump?: (pos: number, bound: number) => void;
  /** 在 [lo,hi] 区间二分探测中点。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 跳跃查找：在升序数组中找 target。
 * @returns 下标；不存在返回 -1。
 */
export function gallopSearch(
  arr: readonly number[],
  target: number,
  hooks: GallopSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  // 1) 指数跳跃，找到首个 arr[pos] >= target 的 pos 作为右界
  let pos = 0;
  if (arr[0]! === target) {
    hooks.onJump?.(0, 0);
    hooks.onDone?.(0);
    return 0;
  }
  let bound = 1;
  while (bound < n && arr[bound]! < target) {
    hooks.onJump?.(bound, bound);
    pos = bound;
    bound <<= 1;
  }
  const lo = pos;
  const hi = Math.min(bound, n - 1);
  // 2) 在 [lo, hi] 二分
  let l = lo;
  let r = hi;
  while (l <= r) {
    const mid = (l + r) >> 1;
    hooks.onProbe?.(l, r, mid);
    const v = arr[mid]!;
    if (v === target) {
      hooks.onDone?.(mid);
      return mid;
    } else if (v < target) {
      l = mid + 1;
      hooks.onShrink?.(l, r, 'right');
    } else {
      r = mid - 1;
      hooks.onShrink?.(l, r, 'left');
    }
  }
  hooks.onDone?.(-1);
  return -1;
}
