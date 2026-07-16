// =============================================================================
// 多项式不定积分
// =============================================================================

export interface PolynomialIntegHooks {
  onTerm?: (i: number, oldCoef: number, newCoef: number) => void;
}

export function polynomialIntegral(coeffs: number[], hooks: PolynomialIntegHooks = {}): number[] {
  const result: number[] = [0]; // 新常数项
  for (let i = 0; i < coeffs.length; i++) {
    const newCoef = coeffs[i]! / (i + 1);
    result.push(newCoef);
    hooks.onTerm?.(i + 1, coeffs[i]!, newCoef);
  }
  return result;
}
