// =============================================================================
// 跳跃搜索 Jump Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface JumpSearchHooks {
  /** 跳到下标 pos 探测块右端。 */
  onJump?: (pos: number) => void;
  /** 已定位到候选块 [blockLo, blockHi)，准备线性扫描。 */
  onBlock?: (blockLo: number, blockHi: number) => void;
  /** 线性扫描时比较下标 i 与 target。 */
  onLinearCompare?: (i: number) => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 跳跃搜索：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 *
 * - 以步长 `step = floor(sqrt(n))` 向右跳跃，直到 `a[pos] >= target` 或越界
 * - 在定位到的块 `[prev, min(pos, n))` 内做线性查找
 *
 * 时间 `O(√n)`（√n 次跳跃 + 最多 √n 次线性比较），空间 `O(1)`。
 * 要求数组已按非降序排列。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function jumpSearch(
  arr: readonly number[],
  target: number,
  hooks: JumpSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  const step = Math.floor(Math.sqrt(n));

  let prev = 0;
  let pos = step;

  // 跳跃：直到 a[min(pos,n)-1] >= target 或越界
  while (pos < n && arr[Math.min(pos, n) - 1]! < target) {
    hooks.onJump?.(Math.min(pos, n) - 1);
    prev = pos;
    pos += step;
    if (prev >= n) {
      hooks.onDone?.(-1);
      return -1;
    }
  }
  // 最后一次跳跃也要标记
  if (pos < n) hooks.onJump?.(Math.min(pos, n) - 1);

  const blockHi = Math.min(pos, n);
  hooks.onBlock?.(prev, blockHi);

  // 线性扫描 [prev, blockHi)
  for (let i = prev; i < blockHi; i++) {
    hooks.onLinearCompare?.(i);
    const v = arr[i]!;
    if (v === target) {
      hooks.onDone?.(i);
      return i;
    }
    if (v > target) break; // 有序，越过后必不存在
  }

  hooks.onDone?.(-1);
  return -1;
}
