// exp 泰勒级数 · 实现
export function expTaylor(x: number, terms = 30): number {
  let sum = 0,
    term = 1;
  for (let n = 0; n < terms; n++) {
    sum += term;
    term *= x / (n + 1);
  }
  return sum;
}
