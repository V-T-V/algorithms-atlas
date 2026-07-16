// 幂运算（迭代）· 实现
export function powerIter(base: number, exp: number): number {
  if (exp < 0 || !Number.isInteger(exp)) throw new RangeError('exp 必须非负整数');
  let r = 1;
  for (let i = 0; i < exp; i++) r *= base;
  return r;
}
