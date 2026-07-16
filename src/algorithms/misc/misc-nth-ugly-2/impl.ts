// 第 N 个丑数 · 实现
export interface NthUglyHooks {
  onStep?: (i: number, value: number) => void;
  onConclude?: (value: number) => void;
}
export function miscNthUgly2(n: number, hooks: NthUglyHooks = {}): number {
  if (n <= 0) throw new Error('n 必须 >= 1 / n must be >= 1');
  const ugly: number[] = new Array(n).fill(0);
  ugly[0] = 1;
  let i2 = 0;
  let i3 = 0;
  let i5 = 0;
  for (let i = 1; i < n; i++) {
    const next = Math.min(ugly[i2]! * 2, ugly[i3]! * 3, ugly[i5]! * 5);
    ugly[i] = next;
    if (next === ugly[i2]! * 2) i2++;
    if (next === ugly[i3]! * 3) i3++;
    if (next === ugly[i5]! * 5) i5++;
    hooks.onStep?.(i, next);
  }
  const value = ugly[n - 1]!;
  hooks.onConclude?.(value);
  return value;
}
