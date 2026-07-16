// ln 的泰勒级数 · 实现
export function lnTaylor(x: number, terms = 50): number {
  if (x <= -1) throw new RangeError('x 必须 > -1');
  let sum = 0;
  for (let n = 1; n <= terms; n++) sum += ((n % 2 === 1 ? 1 : -1) * Math.pow(x, n)) / n;
  return sum;
}
