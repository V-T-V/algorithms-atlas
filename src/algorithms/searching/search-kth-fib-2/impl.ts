// 查找第 k 个斐波那契数 · 纯算法实现
export interface Fib2Hooks {
  onStep?: (k: number, value: number) => void;
}

export function kthFibonacci2(k: number, hooks: Fib2Hooks = {}): number {
  if (k < 0) throw new RangeError('k 不能为负');
  if (k === 0) return 0;
  let a = 0,
    b = 1;
  for (let i = 2; i <= k; i++) {
    const c = a + b;
    hooks.onStep?.(i, c);
    a = b;
    b = c;
  }
  return b;
}
