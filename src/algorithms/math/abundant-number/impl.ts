// =============================================================================
// 盈数判定
// abundant: σ(n) > n；deficient: σ(n) < n；perfect: σ(n) == n
// =============================================================================

export type NumberClass = 'abundant' | 'perfect' | 'deficient';

export interface AbundantHooks {
  onDivisor?: (d: number) => void;
  onSum?: (sum: number) => void;
  onResult?: (kind: NumberClass, sum: number) => void;
}

export interface AbundantResult {
  kind: NumberClass;
  sum: number;
}

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

export function classifyNumber(n: number, hooks: AbundantHooks = {}): AbundantResult {
  if (n < 1) {
    hooks.onResult?.('deficient', 0);
    return { kind: 'deficient', sum: 0 };
  }
  let sum = 0;
  // 列出真因子
  const divs: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      hooks.onDivisor?.(i);
      sum += i;
      const other = n / i;
      if (other !== i && other !== n) {
        divs.push(other);
        hooks.onDivisor?.(other);
        sum += other;
      }
    }
  }
  hooks.onSum?.(sum);
  let kind: NumberClass;
  if (sum > n) kind = 'abundant';
  else if (sum === n) kind = 'perfect';
  else kind = 'deficient';
  hooks.onResult?.(kind, sum);
  void divs;
  return { kind, sum };
}

export function isAbundant(n: number, hooks: AbundantHooks = {}): boolean {
  return classifyNumber(n, hooks).kind === 'abundant';
}
