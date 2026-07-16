// 卡塔兰数 · 纯算法实现

/** 事件钩子。 */
export interface CatalanHooks {
  /** 计算第 k 项：prev → cur。 */
  onStep?: (k: number, prev: number, cur: number) => void;
  /** 最终结果。 */
  onResult?: (n: number, value: number) => void;
}

/**
 * 计算第 n 个卡塔兰数 C(n)（0-based：C(0)=1）。
 * 用递推 C(n) = C(n-1) · 2(2n-1) / (n+1)，全程整数运算。
 */
export function catalanNumber(n: number, hooks: CatalanHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  let c = 1; // C(0)
  for (let k = 1; k <= n; k++) {
    const prev = c;
    // C(k) = C(k-1) * 2 * (2k-1) / (k+1)
    // 为保证整除：先乘 2*(2k-1)，再除 (k+1)。注意此式在整数域上必整除。
    c = (c * 2 * (2 * k - 1)) / (k + 1);
    hooks.onStep?.(k, prev, c);
  }
  hooks.onResult?.(n, c);
  return c;
}

/** 生成前 n 个卡塔兰数 C(0..n-1)。 */
export function catalanSequence(n: number): number[] {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be non-negative integer');
  const seq: number[] = [];
  for (let i = 0; i < n; i++) seq.push(catalanNumber(i));
  return seq;
}
