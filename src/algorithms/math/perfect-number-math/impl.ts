// =============================================================================
// 完全数·数学视角
// 1) sumProperDivisors(n)：真因子和（不含 n 自身）
// 2) isPerfect(n)：sumProperDivisors(n) === n
// 3) divisorsOf(n)：列出全部真因子
// 4) euclidEulerPerfect(p)：当 2^p-1 为素数时，返回偶完全数 2^(p-1)·(2^p-1)
// =============================================================================

export interface PerfectHooks {
  onDivisor?: (d: number) => void;
  onSum?: (sum: number) => void;
  onResult?: (isPerfect: boolean) => void;
}

export interface PerfectResult {
  isPerfect: boolean;
  sum: number;
  divisors: number[];
}

function isPrime(x: number): boolean {
  if (x < 2) return false;
  if (x < 4) return true;
  if (x % 2 === 0) return false;
  for (let i = 3; i * i <= x; i += 2) if (x % i === 0) return false;
  return true;
}

/** 列出 n 的所有真因子（不含 n，含 1），升序。 */
export function divisorsOf(n: number): number[] {
  if (n < 1) return [];
  const small: number[] = [];
  const large: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      if (i !== n) small.push(i);
      const other = n / i;
      if (other !== i && other !== n) large.push(other);
    }
  }
  return [...small, ...large.reverse()];
}

/** n 的真因子和（不含 n 自身）。 */
export function sumProperDivisors(n: number): number {
  if (n < 2) return 0;
  let sum = 1;
  const sqrt = Math.sqrt(n);
  for (let i = 2; i <= sqrt; i++) {
    if (n % i === 0) {
      sum += i;
      const other = n / i;
      if (other !== i) sum += other;
    }
  }
  return sum;
}

export function isPerfect(n: number, hooks: PerfectHooks = {}): PerfectResult {
  if (n < 1) {
    hooks.onResult?.(false);
    return { isPerfect: false, sum: 0, divisors: [] };
  }
  const divs = divisorsOf(n);
  for (const d of divs) hooks.onDivisor?.(d);
  const sum = divs.reduce((a, b) => a + b, 0);
  hooks.onSum?.(sum);
  const ok = sum === n;
  hooks.onResult?.(ok);
  return { isPerfect: ok, sum, divisors: divs };
}

/** Euclid-Euler：若 2^p - 1 为素数，返回偶完全数 2^(p-1)·(2^p-1)；否则返回 null。 */
export function euclidEulerPerfect(p: number): number | null {
  if (p < 2) return null;
  // p 必须为素数，2^p-1 才可能为素数
  if (!isPrime(p)) return null;
  const mersenne = Math.pow(2, p) - 1;
  if (!isPrime(mersenne)) return null;
  return Math.pow(2, p - 1) * mersenne;
}
