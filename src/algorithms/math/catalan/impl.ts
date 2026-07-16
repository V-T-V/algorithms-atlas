// =============================================================================
// 卡特兰数 Catalan Number · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CatalanHooks {
  /** 由递推 C_i = Σ C_k·C_{i-1-k} 累加一次（partial 为当前部分和）。 */
  onAccumulate?: (i: number, k: number, partial: bigint) => void;
  /** 得到第 i 个卡特兰数 C_i。 */
  onComputed?: (i: number, value: number) => void;
}

/**
 * 卡特兰数 C_0 .. C_n（逐项递推，BigInt 精确）。
 *
 * 定义：`C_0 = 1`，`C_{n+1} = Σ_{i=0}^{n} C_i · C_{n-i}`，
 * 等价闭式 `C_n = C(2n, n) / (n+1)`。
 *
 * 组合意义：n 对括号的合法配对数、n 个节点的二叉树形态数、
 * n×n 网格不越过对角线的路径数、凸 (n+2) 边形的三角剖分数等。
 *
 * 本实现用**逐项卷积递推**，便于可视化每一步的累加；BigInt 保证大数精确。
 *
 * - 时间 `O(n²)`
 * - 空间 `O(n)`
 *
 * @param n 非负整数
 * @returns C_0 .. C_n（BigInt 数组）
 */
export function catalan(n: number, hooks: CatalanHooks = {}): bigint[] {
  if (n < 0) throw new RangeError('catalan: n must be non-negative');
  const C: bigint[] = [1n];
  hooks.onComputed?.(0, 1);
  for (let i = 1; i <= n; i++) {
    let sum = 0n;
    for (let k = 0; k < i; k++) {
      sum += C[k]! * C[i - 1 - k]!;
      hooks.onAccumulate?.(i, k, sum);
    }
    C.push(sum);
    hooks.onComputed?.(i, Number(sum));
  }
  return C;
}
