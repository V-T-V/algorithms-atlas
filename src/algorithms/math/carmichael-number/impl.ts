// =============================================================================
// Carmichael 数判定（Korselt 判据）
// n 是 Carmichael 数 iff:
//   1) n 为合数（n >= 2，且非素数）
//   2) n 无平方因子（square-free）
//   3) 对 n 的任意素因子 p，(p-1) 整除 (n-1)
// =============================================================================

export interface CarmichaelHooks {
  onFactor?: (p: number) => void;
  onCheckSquareFree?: (ok: boolean) => void;
  onCheckDivisibility?: (p: number, ok: boolean) => void;
  onResult?: (isCarmichael: boolean) => void;
}

export interface CarmichaelResult {
  isCarmichael: boolean;
  factors: number[];
  squareFree: boolean;
}

function isPrime(x: number): boolean {
  if (x < 2) return false;
  if (x < 4) return true;
  if (x % 2 === 0) return false;
  for (let i = 3; i * i <= x; i += 2) {
    if (x % i === 0) return false;
  }
  return true;
}

export function isCarmichael(n: number, hooks: CarmichaelHooks = {}): CarmichaelResult {
  // 边界：< 2 或素数 → 非 Carmichael
  if (n < 2 || isPrime(n)) {
    hooks.onResult?.(false);
    return { isCarmichael: false, factors: [], squareFree: false };
  }

  // 分解因子（同时检查 square-free 与素性）
  const factors: number[] = [];
  let m = n;
  let d = 2;
  let squareFree = true;
  while (d * d <= m) {
    if (m % d === 0) {
      factors.push(d);
      hooks.onFactor?.(d);
      m /= d;
      if (m % d === 0) {
        // 重复因子 → 非 square-free
        squareFree = false;
      }
      while (m % d === 0) m /= d;
    }
    d++;
  }
  if (m > 1) {
    factors.push(m);
    hooks.onFactor?.(m);
  }
  hooks.onCheckSquareFree?.(squareFree);
  if (!squareFree) {
    hooks.onResult?.(false);
    return { isCarmichael: false, factors, squareFree: false };
  }

  // Korselt: (p-1) | (n-1)
  const nm1 = n - 1;
  let ok = true;
  for (const p of factors) {
    const divides = nm1 % (p - 1) === 0;
    hooks.onCheckDivisibility?.(p, divides);
    if (!divides) ok = false;
  }

  // Carmichael 数至少有 3 个不同素因子（自动满足，因合数 square-free 至少 2 因子，
  // 但 2 因子时 (p-1)|(n-1) 对两素数不可能同时成立 → ok 自动为 false）
  hooks.onResult?.(ok);
  return { isCarmichael: ok, factors, squareFree: true };
}
