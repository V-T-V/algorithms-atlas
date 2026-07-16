// =============================================================================
// 元二分查找（Meta Binary Search / One-Sided）· 纯算法实现
// 用位运算确定 mid：预处理最大的 2^k，从高位到低位决定答案的每一位。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MetaBinaryHooks {
  /** 尝试把答案的第 bit 位设为 1，得到候选 mid。 */
  onProbe?: (bit: number, mid: number) => void;
  /** 决定该位（保留 1 或清 0）。 */
  onDecide?: (bit: number, mid: number, setOne: boolean) => void;
  /** 计算完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * Meta Binary Search：在升序数组中找 target。
 * @returns 下标；不存在返回 -1。
 */
export function metaBinary(
  arr: readonly number[],
  target: number,
  hooks: MetaBinaryHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  // 最高需要的位数
  let k = 1;
  while (1 << k < n) k++;
  let pos = 0;
  for (let bit = k - 1; bit >= 0; bit--) {
    const candidate = pos + (1 << bit);
    hooks.onProbe?.(bit, candidate);
    if (candidate < n && arr[candidate]! <= target) {
      pos = candidate;
      hooks.onDecide?.(bit, candidate, true);
    } else {
      hooks.onDecide?.(bit, candidate, false);
    }
  }
  const found = pos < n && arr[pos]! === target ? pos : -1;
  hooks.onDone?.(found);
  return found;
}
