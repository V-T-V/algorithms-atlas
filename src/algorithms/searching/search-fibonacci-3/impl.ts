// 斐波那契查找 · 纯算法实现
export interface Fib3Hooks {
  onCompare?: (i: number) => void;
}

export function fibonacciSearch3(
  arr: readonly number[],
  target: number,
  hooks: Fib3Hooks = {},
): number {
  const n = arr.length;
  let fib2 = 0,
    fib1 = 1,
    fib = 1;
  while (fib < n) {
    fib2 = fib1;
    fib1 = fib;
    fib = fib1 + fib2;
  }
  let offset = -1;
  while (fib > 1) {
    const i = Math.min(offset + fib2, n - 1);
    hooks.onCompare?.(i);
    if (arr[i]! < target) {
      fib = fib1;
      fib1 = fib2;
      fib2 = fib - fib1;
      offset = i;
    } else if (arr[i]! > target) {
      fib = fib2;
      fib1 = fib1 - fib2;
      fib2 = fib - fib1;
    } else return i;
  }
  if (fib1 === 1 && offset + 1 < n && arr[offset + 1]! === target) return offset + 1;
  return -1;
}
