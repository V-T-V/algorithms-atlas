// 斐波那契搜索 · 实现
export interface FsHooks {
  onIter?: (i: number, a: number, b: number, x1: number, x2: number) => void;
  onConclude?: (xmin: number) => void;
}
export function fibonacciSearch(
  f: (x: number) => number,
  a: number,
  b: number,
  n = 20,
  hooks: FsHooks = {},
): number {
  const fib: number[] = [1, 1];
  while (fib.length < n + 1) fib.push(fib[fib.length - 1]! + fib[fib.length - 2]!);
  let lo = a,
    hi = b;
  let k = n;
  let x1 = lo + (fib[n - 2]! / fib[n]!) * (hi - lo);
  let x2 = lo + (fib[n - 1]! / fib[n]!) * (hi - lo);
  while (k > 2) {
    hooks.onIter?.(n - k, lo, hi, x1, x2);
    if (f(x1) < f(x2)) {
      hi = x2;
      x2 = x1;
      x1 = lo + (fib[k - 3]! / fib[k - 1]!) * (hi - lo);
    } else {
      lo = x1;
      x1 = x2;
      x2 = lo + (fib[k - 2]! / fib[k - 1]!) * (hi - lo);
    }
    k--;
  }
  const xmin = (lo + hi) / 2;
  hooks.onConclude?.(xmin);
  return xmin;
}
