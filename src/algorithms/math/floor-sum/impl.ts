// =============================================================================
// 类欧几里得 Floor Sum · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FloorSumHooks {
  /** 一次「类欧几里得」递归：对 Σ⌊(a·i+b)/m⌋ 的当前参数化简。 */
  onReduce?: (n: number, m: number, a: number, b: number) => void;
  /** 最终结果。 */
  onResult?: (sum: bigint) => void;
}

/**
 * 类欧几里得算法：计算 `Σ_{i=0}^{n-1} ⌊(a·i + b) / m⌋`。
 *
 * 这是 AtCoder Library 中 `floor_sum` 的经典实现（几何类比：统计直线
 * `y = (a·x + b)/m` 下方、`x = 0..n-1` 范围内的整点数）。通过坐标变换把
 * `(m, a, b)` 不断规约到更小的规模，得到 `O(log m)` 递归解。
 *
 * 参数要求：`n ≥ 0`，`m ≥ 1`，`a, b ≥ 0`。
 *
 * - 时间 `O(log m)`，空间 `O(log m)`（递归栈）
 * - 用 BigInt 保证大数精确
 *
 * @param n 求和上界（i = 0..n-1）
 * @param m 分母（≥1）
 * @param a 系数（≥0）
 * @param b 常数（≥0）
 * @param hooks 可选的事件钩子
 * @returns Σ⌊(a·i+b)/m⌋
 */
export function floorSum(
  n: number,
  m: number,
  a: number,
  b: number,
  hooks: FloorSumHooks = {},
): bigint {
  if (n < 0) throw new RangeError('floorSum: n must be non-negative');
  if (m <= 0) throw new RangeError('floorSum: m must be positive');
  if (a < 0 || b < 0) throw new RangeError('floorSum: a and b must be non-negative');
  const ans = fSum(BigInt(n), BigInt(m), BigInt(a), BigInt(b), hooks);
  hooks.onResult?.(ans);
  return ans;
}

/** 递归核心（ACL 公式）：参数已保证 n≥0, m>0, a,b≥0。 */
function fSum(n: bigint, m: bigint, a: bigint, b: bigint, hooks: FloorSumHooks): bigint {
  hooks.onReduce?.(Number(n), Number(m), Number(a), Number(b));
  let ans = 0n;
  if (a >= m) {
    ans += (((n - 1n) * n) / 2n) * (a / m);
    a %= m;
  }
  if (b >= m) {
    ans += n * (b / m);
    b %= m;
  }
  const yMax = (a * n + b) / m;
  const xMax = yMax * m - b;
  if (yMax === 0n) return ans;
  ans += (n - (xMax + a - 1n) / a) * yMax;
  ans += fSum(yMax, a, m, (a - (xMax % a)) % a, hooks);
  return ans;
}
