// 硬币议价 · 实现
export interface FlipHooks {
  onOffer?: (x: number, accepted: boolean) => void;
  onFallback?: (coinResult: 'H' | 'T', winner: 'A' | 'B') => void;
  onOutcome?: (aPay: number, bPay: number) => void;
}
export function flipBargaining(
  offerX: number,
  fallbackHeadsProb: number,
  hooks: FlipHooks = {},
): { aPayoff: number; bPayoff: number; accepted: boolean } {
  // B 接受 iff x >= fallback 期望 (即 fallbackHeadsProb*0 + (1-p)*1)
  const bFallback = 1 - fallbackHeadsProb;
  const accepted = offerX >= bFallback - 1e-9;
  hooks.onOffer?.(offerX, accepted);
  let aPayoff: number, bPayoff: number;
  if (accepted) {
    aPayoff = 1 - offerX;
    bPayoff = offerX;
  } else {
    const heads = Math.random() < fallbackHeadsProb;
    hooks.onFallback?.(heads ? 'H' : 'T', heads ? 'A' : 'B');
    aPayoff = heads ? 1 : 0;
    bPayoff = heads ? 0 : 1;
  }
  hooks.onOutcome?.(aPayoff, bPayoff);
  return { aPayoff, bPayoff, accepted };
}
