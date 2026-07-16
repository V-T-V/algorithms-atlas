// =============================================================================
// 斜率优化DP（Slope Trick）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// Slope Trick：维护分段线性凸函数的「斜率变化点」集合，用大根堆高效合并。
// 经典应用：把数组 a 变成非递减（每次 +1 或 -1 代价 1）的最小操作次数。
//   设 b[i] = min(b[i-1], a[i]) 的非递减序列；答案 = Σ (a[i] - b[i])。
//   用堆维护：每读入 a[i]，push 两次，弹出堆顶并累加差值。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SlopeTrickHooks {
  /** 处理第 i 个元素（值 a[i]），堆中插入/弹出后堆顶为 top。 */
  onElement?: (i: number, ai: number, top: number) => void;
  /** 弹出堆顶 popped，累计代价 inc（说明此处需「下压」）。 */
  onPop?: (i: number, popped: number, inc: number) => void;
  /** 确定调整后的值：result[i]。 */
  onSetValue?: (i: number, original: number, adjusted: number) => void;
}

/**
 * Slope Trick：把数组 `a` 变成非递减（每次可 +1 或 -1，代价 1）的最小总操作次数，
 * 同时给出调整后的非递减数组。
 *
 * 算法（最大堆维护斜率变化点）：\n- 维护一个最大堆。对每个 `a[i]`：push `a[i]` 两次；
 *   弹出堆顶 `maxTop`，把代价累加 `max(0, maxTop - a[i])`（此处函数需下压）。
 * - 弹出的堆顶即新的「最优取值点」。
 *
 * @param a 输入数组
 * @param hooks 可选事件钩子
 * @returns `{ cost, result }`：最小操作次数 与 调整后的非递减数组。
 */
export function slopeTrick(
  a: readonly number[],
  hooks: SlopeTrickHooks = {},
): { cost: number; result: number[] } {
  const n = a.length;
  if (n === 0) return { cost: 0, result: [] };

  // 最大堆（用取负的最小堆模拟）
  const heap: number[] = [];
  const push = (x: number): void => {
    heap.push(-x);
    heap.sort((p, q) => p - q); // 小根堆（存负数 = 大根堆）
  };
  const popMax = (): number => {
    heap.sort((p, q) => p - q);
    return -heap.pop()!;
  };
  const peekMax = (): number => {
    heap.sort((p, q) => p - q);
    return -heap[0]!;
  };

  let cost = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i]!;
    push(x);
    const top = peekMax();
    if (top > x) {
      cost += top - x;
      hooks.onPop?.(i, top, top - x);
      popMax();
      push(x);
    }
    hooks.onElement?.(i, x, peekMax());
  }

  // 还原调整后的非递减数组：把堆中剩余元素升序取出，配合 max(prev, a[i])
  // 标准还原法：从堆里取出 n 个值（升序），与原数组逐位取 max
  const tops: number[] = heap.map((v) => -v).sort((p, q) => p - q);
  const result = new Array<number>(n);
  let prev = -Infinity;
  for (let i = 0; i < n; i++) {
    const t = tops[i] ?? a[i]!;
    const adj = Math.max(prev, Math.min(t, a[i]!));
    result[i] = adj;
    prev = adj;
    hooks.onSetValue?.(i, a[i]!, adj);
  }

  return { cost, result };
}
