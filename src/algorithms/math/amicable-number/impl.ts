// =============================================================================
// 亲和数对
// s(n) = n 的真因子和（不含 n）。a 的配对 = s(a)。
// (a,b) 亲和 iff b = s(a) 且 a = s(b) 且 a != b。
// =============================================================================

export interface AmicableHooks {
  onSum?: (n: number, sum: number) => void;
  onCheck?: (a: number, b: number, amicable: boolean) => void;
  onResult?: (partner: number | null, amicable: boolean) => void;
  onPair?: (a: number, b: number) => void;
}

export interface AmicableResult {
  partner: number | null;
  amicable: boolean;
}

/** n 的真因子和（不含 n）。 */
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

/** 判定 n 是否属于某个亲和数对；返回其配对（若无则 null）。 */
export function amicablePartner(n: number, hooks: AmicableHooks = {}): AmicableResult {
  if (n < 2) {
    hooks.onResult?.(null, false);
    return { partner: null, amicable: false };
  }
  const sa = sumProperDivisors(n);
  hooks.onSum?.(n, sa);
  // 配对必须为正且 != n
  if (sa <= 1 || sa === n) {
    hooks.onResult?.(null, false);
    return { partner: null, amicable: false };
  }
  const sb = sumProperDivisors(sa);
  hooks.onSum?.(sa, sb);
  const ok = sb === n;
  hooks.onCheck?.(n, sa, ok);
  hooks.onResult?.(ok ? sa : null, ok);
  return { partner: ok ? sa : null, amicable: ok };
}

/** 搜索 [1, limit] 内的所有亲和数对（a<b，去重）。 */
export function findAmicablePairs(
  limit: number,
  hooks: AmicableHooks = {},
): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let a = 2; a <= limit; a++) {
    const b = sumProperDivisors(a);
    if (b > a && b <= limit) {
      if (sumProperDivisors(b) === a) {
        pairs.push([a, b]);
        hooks.onPair?.(a, b);
      }
    }
  }
  return pairs;
}
