// 阶乘末尾零（朴素）· 实现
export interface FactorialTrailHooks {
  onIter?: (i: number, factorial: bigint) => void;
  onConclude?: (zeros: number) => void;
}
export function miscFactorialTrail2(n: number, hooks: FactorialTrailHooks = {}): number {
  if (n < 0) throw new Error('n 必须 >= 0 / n must be >= 0');
  let f = 1n;
  for (let i = 2; i <= n; i++) {
    f *= BigInt(i);
    hooks.onIter?.(i, f);
  }
  const s = f.toString();
  let zeros = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] !== '0') break;
    zeros++;
  }
  hooks.onConclude?.(zeros);
  return zeros;
}
