// 快速幂（尾递归）· 纯算法实现
export interface PowTailHooks {
  onStep?: (base: number, exp: number, acc: number) => void;
  onResult?: (result: number) => void;
}

export function fastPowTail(base: number, exp: number, hooks: PowTailHooks = {}): number {
  if (exp < 0) throw new Error('指数不支持负数');
  const helper = (b: number, e: number, acc: number): number => {
    if (e === 0) return acc;
    hooks.onStep?.(b, e, acc);
    if (e % 2 === 0) return helper(b * b, e >> 1, acc);
    return helper(b, e - 1, acc * b);
  };
  const r = helper(base, exp, 1);
  hooks.onResult?.(r);
  return r;
}
