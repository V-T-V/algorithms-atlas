// sin 泰勒级数 · 实现
export function sinTaylor(x: number, terms = 15): number {
  let sum = 0,
    term = x;
  for (let n = 0; n < terms; n++) {
    sum += term;
    term *= (-x * x) / ((2 * n + 2) * (2 * n + 3));
  }
  return sum;
}
