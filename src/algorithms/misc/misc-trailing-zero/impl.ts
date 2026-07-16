// 阶乘末尾零（数学）· 实现
export interface TrailingZeroHooks {
  onStep?: (divisor: number, contribution: number) => void;
  onConclude?: (zeros: number) => void;
}
export function miscTrailingZero(n: number, hooks: TrailingZeroHooks = {}): number {
  let zeros = 0;
  let divisor = 5;
  while (divisor <= n) {
    const contrib = Math.floor(n / divisor);
    zeros += contrib;
    hooks.onStep?.(divisor, contrib);
    divisor *= 5;
  }
  hooks.onConclude?.(zeros);
  return zeros;
}
