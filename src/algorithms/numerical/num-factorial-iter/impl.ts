// 阶乘（迭代）· 实现
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new RangeError('n 必须非负整数');
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
