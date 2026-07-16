// 互递归判奇偶（isEven/isOdd）· 纯算法实现

/** 事件钩子。 */
export interface MutualHooks {
  /** 进入某函数（给出函数名 fn 与参数 n）。 */
  onEnter?: (fn: 'isEven' | 'isOdd', n: number, depth: number) => void;
  /** 命中基线。 */
  onBase?: (fn: 'isEven' | 'isOdd', result: boolean) => void;
  /** 从某层返回。 */
  onReturn?: (fn: 'isEven' | 'isOdd', n: number, result: boolean, depth: number) => void;
}

/**
 * isEven：n 为偶数当且仅当 isOdd(n−1)。
 * 仅接受非负整数（教学版，非负）。
 */
export function isEven(n: number, hooks: MutualHooks = {}, depth: number = 0): boolean {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`n 须为非负整数: ${n}`);
  hooks.onEnter?.('isEven', n, depth);
  if (n === 0) {
    hooks.onBase?.('isEven', true);
    hooks.onReturn?.('isEven', n, true, depth);
    return true;
  }
  const r = isOdd(n - 1, hooks, depth + 1);
  hooks.onReturn?.('isEven', n, r, depth);
  return r;
}

/**
 * isOdd：n 为奇数当且仅当 isEven(n−1)。
 */
export function isOdd(n: number, hooks: MutualHooks = {}, depth: number = 0): boolean {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`n 须为非负整数: ${n}`);
  hooks.onEnter?.('isOdd', n, depth);
  if (n === 0) {
    hooks.onBase?.('isOdd', false);
    hooks.onReturn?.('isOdd', n, false, depth);
    return false;
  }
  const r = isEven(n - 1, hooks, depth + 1);
  hooks.onReturn?.('isOdd', n, r, depth);
  return r;
}
