// =============================================================================
// 阶乘尾部零 · Legendre 公式
// =============================================================================

export interface TrailingZerosHooks {
  onTerm?: (power: number, term: number, runningSum: number) => void;
}

export function trailingZeros(n: number, hooks: TrailingZerosHooks = {}): number {
  let result = 0;
  let power = 5;
  while (power <= n) {
    const term = Math.floor(n / power);
    result += term;
    hooks.onTerm?.(power, term, result);
    // 防溢出：若 power * 5 超过 Number.MAX_SAFE_INTEGER 则提前结束
    if (power > Number.MAX_SAFE_INTEGER / 5) break;
    power *= 5;
  }
  return result;
}
