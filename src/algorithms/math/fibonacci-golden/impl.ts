// =============================================================================
// 斐波那契（黄金比公式）· 纯算法实现
// 用 Z[√5] = (a + b√5) 环上的快速幂精确实现 Binet 公式。
// =============================================================================

/** 事件钩子。 */
export interface FibonacciGoldenHooks {
  /** 每轮指数右移：当前 φ^n 表示 (a,b)，bit 为当前指数位。 */
  onStep?: (bit: 0 | 1, a: bigint, b: bigint) => void;
  /** 完成。 */
  onResult?: (n: number, value: bigint) => void;
}

/** 在环 Z[√5] 中表示元素 (a + b√5)。乘法：(a+b√5)(c+d√5) = (ac+5bd) + (ad+bc)√5。 */
interface RingElem {
  a: bigint;
  b: bigint;
}

function ringMul(x: RingElem, y: RingElem): RingElem {
  return { a: x.a * y.a + 5n * x.b * y.b, b: x.a * y.b + x.b * y.a };
}

/**
 * 用 Binet 公式（Z[√5] 快速幂）计算 F(n)。
 * φ^n = (a_n + b_n√5)/2^n；F(n) = (φ^n − ψ^n)/√5 = b_n。
 * @returns F(n) as BigInt，F(0)=0, F(1)=1
 */
export function fibonacciGolden(n: number, hooks: FibonacciGoldenHooks = {}): bigint {
  if (n < 0) throw new RangeError('fibonacciGolden: n must be non-negative');
  if (n === 0) return 0n;
  // φ = (1+√5)/2，在 Z[√5] 上（带分母 2）用 (1+√5) 快速幂，再调整分母
  // 为避免分母，直接求 (1+√5)^n / 2^n 的 √5 系数 = F(n)
  // 但更简单：维护 (a + b√5) = (1+√5)^n，最终 F(n) = b / 2^(n-1) 不直观。
  // 标准做法：维护 (1+√5)^n，b 即 Lucas 数相关；改用 (φ^n) 的精确表示。
  // 这里采用：维护 base = (1,1)（即 1+√5），result = (1,0)（即 1），
  // 二进制幂。设 (1+√5)^n = (A + B√5)，则 F(n) = B / 2^(n-1)... 复杂。
  // 改为维护 φ 的表示：φ = (1+√5)/2，故 φ^n = (A+B√5)/2^n。
  // 用整数对 (A, B) 表示 2^n·φ^n = (1+√5)^n 的展开，再除 2^n。
  // 实际只需 B / 2^(n-1) 不对。正确：F(n) = round(φ^n/√5)，而 (1+√5)^n 的 √5 系数 B 满足 F(n)=B/2^n？验证 n=1：(1+√5)，B=1，2^1=2，1/2≠1。
  // 正确关系：φ^n = (L_n + F_n·√5)/2，其中 L_n 为 Lucas 数。
  // 所以 (2φ)^n = (1+√5)^n = 2^(n-1)·(L_n + F_n√5) → (1+√5)^n 的 √5 系数 = 2^(n-1)·F_n。
  // 因此 F(n) = B / 2^(n-1)。
  let result: RingElem = { a: 1n, b: 0n }; // result = 1
  let base: RingElem = { a: 1n, b: 1n }; // base = 1+√5
  let e = n;
  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    hooks.onStep?.(bit, result.a, result.b);
    if (bit === 1) result = ringMul(result, base);
    e = Math.floor(e / 2);
    if (e > 0) base = ringMul(base, base);
  }
  // result = (1+√5)^n，F(n) = result.b / 2^(n-1)
  let pow2 = 1n;
  for (let i = 0; i < n - 1; i++) pow2 *= 2n;
  const fn = result.b / pow2;
  hooks.onResult?.(n, fn);
  return fn;
}
