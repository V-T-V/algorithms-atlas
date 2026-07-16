// =============================================================================
// 斐波那契（Fibonacci）· 纯算法实现
// 零 DOM 依赖，可独立单测。提供三种方法：朴素递归 / 记忆化 / 矩阵快速幂。
// 通过「钩子」暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FibonacciHooks {
  /** 朴素递归进入 fib(n)。给出 n。 */
  onRecurse?: (n: number) => void;
  /** 记忆化命中（fib(n) 已缓存）。给出 n 与缓存值。 */
  onMemoHit?: (n: number, value: number) => void;
  /** 记忆化写入缓存。给出 n 与值。 */
  onMemoStore?: (n: number, value: number) => void;
  /** 矩阵快速幂：一次矩阵平方/乘法。给出当前幂指数 k。 */
  onMatrixStep?: (k: number) => void;
  /** 得出 fib(n)。给出方法名与结果。 */
  onResult?: (method: string, n: number, value: number) => void;
}

/**
 * 方法一：朴素递归。fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)。
 * 时间 O(2^n)（指数级，大量重复计算），空间 O(n)（递归栈）。
 */
export function fibRecursive(n: number, hooks: FibonacciHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`fib 要求非负整数，收到 ${n}`);
  }
  hooks.onRecurse?.(n);
  if (n < 2) {
    hooks.onResult?.('recursive', n, n);
    return n;
  }
  const v = fibRecursive(n - 1, hooks) + fibRecursive(n - 2, hooks);
  return v;
}

/**
 * 方法二：记忆化递归。用缓存避免重复计算。
 * 时间 O(n)，空间 O(n)。
 */
export function fibMemoized(n: number, hooks: FibonacciHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`fib 要求非负整数，收到 ${n}`);
  }
  const memo = new Map<number, number>();
  const solve = (k: number): number => {
    if (k < 2) return k;
    if (memo.has(k)) {
      hooks.onMemoHit?.(k, memo.get(k)!);
      return memo.get(k)!;
    }
    const v = solve(k - 1) + solve(k - 2);
    memo.set(k, v);
    hooks.onMemoStore?.(k, v);
    return v;
  };
  const r = solve(n);
  hooks.onResult?.('memoized', n, r);
  return r;
}

/** 2x2 矩阵（用 4 个数表示）。 */
interface Mat2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

function matMul(x: Mat2, y: Mat2): Mat2 {
  return {
    a: x.a * y.a + x.b * y.c,
    b: x.a * y.b + x.b * y.d,
    c: x.c * y.a + x.d * y.c,
    d: x.c * y.b + x.d * y.d,
  };
}

/**
 * 方法三：矩阵快速幂。
 * 利用 [[1,1],[1,0]]^n = [[fib(n+1),fib(n)],[fib(n),fib(n-1)]]，
 * 用快速幂（二进制拆分指数）在 O(log n) 次矩阵乘法内求得。
 * 时间 O(log n)，空间 O(log n)（递归栈）。
 */
export function fibMatrix(n: number, hooks: FibonacciHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`fib 要求非负整数，收到 ${n}`);
  }
  if (n < 2) {
    hooks.onResult?.('matrix', n, n);
    return n;
  }
  // 基矩阵
  const base: Mat2 = { a: 1, b: 1, c: 1, d: 0 };
  // 快速幂求 base^(n-1)，结果 .a 即 fib(n)
  let result: Mat2 = { a: 1, b: 0, c: 0, d: 1 }; // 单位阵
  let power = base;
  let e = n - 1;
  while (e > 0) {
    if (e & 1) {
      result = matMul(result, power);
    }
    hooks.onMatrixStep?.(e);
    power = matMul(power, power);
    e = Math.floor(e / 2);
  }
  const v = result.a;
  hooks.onResult?.('matrix', n, v);
  return v;
}

/** 生成斐波那契数列前 n 项（从 fib(0) 开始）。 */
export function fibonacciSequence(n: number): number[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`n 要求非负整数，收到 ${n}`);
  }
  const seq: number[] = [];
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    seq.push(a);
    const t = a + b;
    a = b;
    b = t;
  }
  return seq;
}
