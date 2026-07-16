// 回文数构造 · 实现
export interface PdHooks {
  onIter?: (i: number, n: number) => void;
  onConclude?: (palindrome: number, iters: number) => void;
}
function reverseNum(n: number): number {
  let r = 0,
    x = n;
  while (x > 0) {
    r = r * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return r;
}
function isPal(n: number): boolean {
  return n === reverseNum(n);
}
export function palindromeConstruct(
  n: number,
  maxIters = 100,
  hooks: PdHooks = {},
): { palindrome: number; iters: number } {
  let x = n,
    i = 0;
  while (!isPal(x) && i < maxIters) {
    x = x + reverseNum(x);
    i++;
    hooks.onIter?.(i, x);
  }
  hooks.onConclude?.(x, i);
  return { palindrome: x, iters: i };
}
