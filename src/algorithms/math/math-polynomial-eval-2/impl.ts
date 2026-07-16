// =============================================================================
// 多项式求值 · 秦九韶
// =============================================================================

export interface PolynomialEvalHooks {
  onStep?: (i: number, acc: number) => void;
}

export function polynomialEval(
  coeffs: number[],
  x: number,
  hooks: PolynomialEvalHooks = {},
): number {
  if (coeffs.length === 0) return 0;
  let acc = 0;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    acc = acc * x + coeffs[i]!;
    hooks.onStep?.(i, acc);
  }
  return acc;
}
