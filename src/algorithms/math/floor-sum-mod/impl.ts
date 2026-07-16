// =============================================================================
// 类欧几里得 floor_sum（BigInt）· 纯算法实现
// Σ_{i=0}^{n-1} ⌊(a·i+b)/m⌋。AtCoder Library 风格的 BigInt 版。
// =============================================================================

/** 事件钩子。 */
export interface FloorSumModHooks {
  /** 一次递归规约：当前 (n, m, a, b)。 */
  onReduce?: (n: bigint, m: bigint, a: bigint, b: bigint) => void;
  /** 完成。 */
  onResult?: (sum: bigint) => void;
}

/**
 * 计算 Σ_{i=0}^{n-1} ⌊(a·i+b)/m⌋。
 * 要求 n>=0, m>0, a>=0, b>=0。
 */
export function floorSum(
  n: number | bigint,
  m: number | bigint,
  a: number | bigint,
  b: number | bigint,
  hooks: FloorSumModHooks = {},
): bigint {
  const nn = typeof n === 'number' ? BigInt(n) : n;
  const mm = typeof m === 'number' ? BigInt(m) : m;
  const aa = typeof a === 'number' ? BigInt(a) : a;
  const bb = typeof b === 'number' ? BigInt(b) : b;
  if (nn < 0n || mm <= 0n || aa < 0n || bb < 0n) {
    throw new RangeError('floorSum: require n>=0, m>0, a>=0, b>=0');
  }
  const result = rec(nn, mm, aa, bb, hooks, 0);
  hooks.onResult?.(result);
  return result;
}

function rec(
  n: bigint,
  m: bigint,
  a: bigint,
  b: bigint,
  hooks: FloorSumModHooks,
  depth: number,
): bigint {
  if (depth < 20) hooks.onReduce?.(n, m, a, b);
  let ans = 0n;
  // a >= m: 拆出 ⌊a/m⌋·n(n-1)/2
  if (a >= m) {
    ans += ((a / m) * n * (n - 1n)) / 2n;
    a %= m;
  }
  // b >= m: 拆出 ⌊b/m⌋·n
  if (b >= m) {
    ans += (b / m) * n;
    b %= m;
  }
  // y_max = ⌊(a·(n-1)+b)/m⌋  —— 注意是 a·n+b（ACL 形式）
  const yMax = (a * n + b) / m;
  const xMax = yMax * m - b;
  if (yMax === 0n) return ans;
  ans += (n - (xMax + a - 1n) / a) * yMax;
  ans += rec(yMax, a, m, (a - (xMax % a)) % a, hooks, depth + 1);
  return ans;
}
