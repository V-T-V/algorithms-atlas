// =============================================================================
// 威尔逊定理 Wilson Theorem · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface WilsonHooks {
  /** 累乘一次：(prod_so_far) × i mod n。 */
  onMultiply?: (i: number, prodMod: number) => void;
  /** 判定结果： (n-1)! mod n 是否为 n-1（即 n 是否为素数）。 */
  onResult?: (n: number, factorialMod: number, isPrime: boolean) => void;
}

/**
 * 威尔逊定理：对于整数 `n > 1`，`n` 为素数 **当且仅当** `(n−1)! ≡ −1 (mod n)`，
 * 即 `(n−1)! mod n = n − 1`。
 *
 * 本函数依此定理判定素性：顺序计算 `1·2·…·(n−1) mod n`，最后比较是否等于 `n−1`。
 * 用 BigInt 防止中间乘积溢出。
 *
 * 注意：这是教学演示算法，复杂度 `O(n)`，远不如试除法 `O(√n)` 实用，更不能与
 * Miller–Rabin 等概率算法相比。
 *
 * @param n 待判定整数（>1）
 * @param hooks 可选的事件钩子
 * @returns `n` 是否为素数
 */
export function wilson(n: number, hooks: WilsonHooks = {}): boolean {
  if (!Number.isInteger(n) || n < 2) {
    hooks.onResult?.(n, NaN, false);
    return false;
  }
  const m = BigInt(n);
  let prod = 1n % m;
  // 累乘 2 .. (n-1)，即 (n-1)! / 1
  for (let i = 2; i <= n - 1; i++) {
    prod = (prod * BigInt(i)) % m;
    hooks.onMultiply?.(i, Number(prod));
  }
  // 此时 prod = (n-1)! mod n
  const factorialMod = prod;
  const isPrime = factorialMod === m - 1n;
  hooks.onResult?.(n, Number(factorialMod), isPrime);
  return isPrime;
}
