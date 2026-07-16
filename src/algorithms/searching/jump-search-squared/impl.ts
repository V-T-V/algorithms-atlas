// =============================================================================
// 平方跳跃搜索（Jump Search · Squared）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface JumpSquaredHooks {
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
 * 平方跳跃搜索：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function jumpSearchSquared(
  arr: readonly number[],
  target: number,
  hooks: JumpSquaredHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  const step = Math.floor(Math.sqrt(n)); // 最优块大小

  let prev = 0;
  let pos = step;

  while (pos < n && arr[pos - 1]! < target) {
    hooks.onJump?.(pos - 1);
    prev = pos;
    pos += step;
    if (prev >= n) {
      hooks.onDone?.(-1);
      return -1;
    }
  }
  if (pos < n) hooks.onJump?.(pos - 1);

  const blockHi = Math.min(pos, n);
  hooks.onBlock?.(prev, blockHi);

  for (let i = prev; i < blockHi; i++) {
    hooks.onLinearCompare?.(i);
    const v = arr[i]!;
    if (v === target) {
      hooks.onDone?.(i);
      return i;
    }
    if (v > target) break;
  }

  hooks.onDone?.(-1);
  return -1;
}
