// =============================================================================
// 多项式乘法 · 朴素 O(nm)
// =============================================================================

export interface PolynomialMultHooks {
  onProduct?: (i: number, j: number, term: number, dest: number) => void;
}

export function polynomialMultiply(
  a: number[],
  b: number[],
  hooks: PolynomialMultHooks = {},
): number[] {
  const result = new Array<number>(Math.max(1, a.length + b.length - 1)).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const term = a[i]! * b[j]!;
      const dest = i + j;
      result[dest] = result[dest]! + term;
      hooks.onProduct?.(i, j, term, dest);
    }
  }
  return result;
}

export function trimPoly(p: number[]): number[] {
  let end = p.length;
  while (end > 1 && p[end - 1] === 0) end--;
  return p.slice(0, end);
}
