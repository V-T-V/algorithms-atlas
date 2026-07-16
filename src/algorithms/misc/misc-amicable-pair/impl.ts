// 亲和数对 · 实现
export interface ApHooks {
  onCheck?: (a: number, sumDiv: number, isAmicable: boolean) => void;
  onConclude?: (pairs: Array<[number, number]>) => void;
}
function sumProperDiv(n: number): number {
  if (n < 2) return 0;
  let s = 1;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      s += i;
      if (i !== n / i) s += n / i;
    }
  }
  return s;
}
export function amicablePairs(limit: number, hooks: ApHooks = {}): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let a = 2; a <= limit; a++) {
    const b = sumProperDiv(a);
    if (b > a && b <= limit && sumProperDiv(b) === a) {
      pairs.push([a, b]);
      hooks.onCheck?.(a, b, true);
    } else hooks.onCheck?.(a, b, false);
  }
  hooks.onConclude?.(pairs);
  return pairs;
}
