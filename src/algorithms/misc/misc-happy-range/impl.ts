// 快乐数区间 · 实现
export interface HrHooks {
  onNumber?: (n: number, isHappy: boolean) => void;
  onConclude?: (count: number) => void;
}
function isHappy(n: number): boolean {
  const seen = new Set<number>();
  let x = n;
  while (x !== 1 && !seen.has(x)) {
    seen.add(x);
    let s = 0;
    while (x > 0) {
      const d = x % 10;
      s += d * d;
      x = Math.floor(x / 10);
    }
    x = s;
  }
  return x === 1;
}
export function happyRange(lo: number, hi: number, hooks: HrHooks = {}): number {
  let count = 0;
  for (let n = lo; n <= hi; n++) {
    const h = isHappy(n);
    if (h) count++;
    hooks.onNumber?.(n, h);
  }
  hooks.onConclude?.(count);
  return count;
}
