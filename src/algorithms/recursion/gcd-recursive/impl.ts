// 递归欧几里得 GCD · 纯算法实现

/** 事件钩子。 */
export interface GcdRecursiveHooks {
  /** 进入一层递归 gcd(a, b)。 */
  onRecurse?: (a: number, b: number, depth: number) => void;
  /** 递归到底返回 a（此时 b == 0）。 */
  onBase?: (a: number, depth: number) => void;
  /** 返回上一层时的结果。 */
  onReturn?: (a: number, b: number, depth: number, result: number) => void;
}

/**
 * 递归欧几里得算法：求 gcd(a, b)。
 * a、b 为非负整数；gcd(0,0) 定义为 0。
 */
export function gcdRecursive(
  a: number,
  b: number,
  hooks: GcdRecursiveHooks = {},
  depth = 0,
): number {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
    throw new RangeError('gcd requires non-negative integers');
  }
  hooks.onRecurse?.(a, b, depth);
  if (b === 0) {
    hooks.onBase?.(a, depth);
    return a;
  }
  const r = gcdRecursive(b, a % b, hooks, depth + 1);
  hooks.onReturn?.(a, b, depth, r);
  return r;
}

/** 扩展欧几里得：返回 gcd 及 ax + by = gcd 的一组解。 */
export function extGcdRecursive(a: number, b: number): { g: number; x: number; y: number } {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
    throw new RangeError('extGcd requires non-negative integers');
  }
  if (b === 0) return { g: a, x: 1, y: 0 };
  const sub = extGcdRecursive(b, a % b);
  return { g: sub.g, x: sub.y, y: sub.x - Math.floor(a / b) * sub.y };
}
