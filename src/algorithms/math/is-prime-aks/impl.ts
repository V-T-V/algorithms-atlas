// =============================================================================
// AKS 素性测试（Agrawal-Kayal-Saxena）· 纯算法实现
// 简化版：n 是素数 ⟺ (x-1)^n ≡ (x^n - 1) (mod n, x) 在多项式环中。
// 即二项式系数 C(n,k) 对所有 0<k<n 都被 n 整除。
// 严格 AKS 是 O(log^6 n) 多项式时间，本实现给出基于二项式系数的直接验证，
// 适合教学与小 n（系数用 BigInt 精确计算）。
// 与 miller-rabin（概率）和试除法（指数）对比：AKS 是确定性多项式算法。
// =============================================================================

export interface AksHooks {
  onCoefficient?: (k: number, coeff: bigint, divisible: boolean) => void;
  onResult?: (prime: boolean) => void;
}

const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));

export function isPrimeAks(n: number, hooks: AksHooks = {}): boolean {
  const N = BigInt(n);
  if (n < 2) {
    hooks.onResult?.(false);
    return false;
  }
  // 步骤 1：若 n = a^b (b>1)，则合数。简单检查完全幂
  for (let b = 2; b * b <= n; b++) {
    // 求 n 的 b 次整数根
    let lo = 2n;
    let hi = BigInt(Math.ceil(Math.pow(n, 1 / b))) + 1n;
    while (lo <= hi) {
      const mid = (lo + hi) / 2n;
      let p = 1n;
      for (let i = 0; i < b; i++) p *= mid;
      if (p === N) {
        hooks.onResult?.(false);
        return false; // 完全幂
      }
      if (p < N) lo = mid + 1n;
      else hi = mid - 1n;
    }
  }
  // 步骤 2：检查小因子（小素数试除到 log²n 级，此处简化为试除小素数）
  for (let d = 2; d <= Math.min(n - 1, Math.floor(Math.sqrt(n)) + 1); d++) {
    if (n % d === 0) {
      if (n !== d) {
        hooks.onResult?.(false);
        return false;
      }
    }
  }

  // 核心：检查 (x-1)^n 的二项式系数 C(n,k) 是否都被 n 整除（0<k<n）
  // 系数计算：相邻二项式系数递推 C(n,k) = C(n,k-1) * (n-k+1) / k
  // 我们逐项检查「n 是否整除 C(n,k)」
  // 由于精确除法可能不整除，用组合数精确公式（保证整除）：C(n,k) 必为整数
  for (let k = 1; k < n; k++) {
    const coeff = binomial(BigInt(n), BigInt(k));
    const divisible = coeff % N === 0n;
    hooks.onCoefficient?.(k, coeff, divisible);
    if (!divisible) {
      hooks.onResult?.(false);
      return false;
    }
  }
  hooks.onResult?.(true);
  return true;
}

function binomial(n: bigint, k: bigint): bigint {
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let result = 1n;
  for (let i = 0n; i < k; i++) {
    result = (result * (n - i)) / (i + 1n);
  }
  return result;
}

/** 给 gcd 接口留出口（避免未使用警告）。 */
export const _gcd = gcd;
