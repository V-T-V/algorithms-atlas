// arctan 泰勒级数 · 实现
export function atanTaylor(x: number, terms = 100): number {
  let sum = 0;
  for (let n = 0; n < terms; n++)
    sum += ((n % 2 === 0 ? 1 : -1) * Math.pow(x, 2 * n + 1)) / (2 * n + 1);
  return sum;
}
