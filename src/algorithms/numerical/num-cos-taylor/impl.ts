// cos 泰勒级数 · 实现
export function cosTaylor(x: number, terms = 15): number {
  let sum = 0,
    term = 1;
  for (let n = 0; n < terms; n++) {
    sum += term;
    term *= (-x * x) / ((2 * n + 1) * (2 * n + 2));
  }
  return sum;
}
