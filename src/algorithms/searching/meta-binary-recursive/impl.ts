// =============================================================================
// 元二分查找（递归版）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MetaBinaryRecHooks {
  /** 尝试把答案的第 bit 位设为 1，得到候选 mid。 */
  onProbe?: (bit: number, mid: number) => void;
  /** 决定该位（保留 1 或清 0）。 */
  onDecide?: (bit: number, mid: number, setOne: boolean) => void;
  /** 计算完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 元二分查找（递归版）：在升序数组中找 target。
 * @returns 下标；不存在返回 -1。
 */
export function metaBinaryRecursive(
  arr: readonly number[],
  target: number,
  hooks: MetaBinaryRecHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  // 最高需要的位数 k：使 1<<k >= n
  let k = 0;
  while (1 << k < n) k++;

  // 递归处理第 bit 位（从高到低），pos 为已确定的高位累加
  const solve = (bit: number, pos: number): number => {
    if (bit < 0) return pos;
    const candidate = pos + (1 << bit);
    hooks.onProbe?.(bit, candidate);
    if (candidate < n && arr[candidate]! <= target) {
      hooks.onDecide?.(bit, candidate, true);
      return solve(bit - 1, candidate);
    }
    hooks.onDecide?.(bit, candidate, false);
    return solve(bit - 1, pos);
  };

  const pos = solve(k - 1, 0);
  const found = pos < n && arr[pos]! === target ? pos : -1;
  hooks.onDone?.(found);
  return found;
}
