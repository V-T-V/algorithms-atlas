// =============================================================================
// 多项式求导
// =============================================================================

export interface PolynomialDerivHooks {
  onTerm?: (i: number, oldCoef: number, newCoef: number) => void;
}

export function polynomialDerivative(coeffs: number[], hooks: PolynomialDerivHooks = {}): number[] {
  if (coeffs.length <= 1) return [];
  const result: number[] = [];
  for (let i = 1; i < coeffs.length; i++) {
    const newCoef = i * coeffs[i]!;
    result.push(newCoef);
    hooks.onTerm?.(i, coeffs[i]!, newCoef);
  }
  // 去除尾部零（仅当多项式化为更短时）
  while (result.length > 1 && result[result.length - 1] === 0) result.pop();
  return result;
}
