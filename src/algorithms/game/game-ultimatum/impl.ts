// =============================================================================
// 最后通牒博弈 · 纯算法实现
// 提议者给出 offer ∈ [0, pool]；回应者按阈值 threshold 决定 accept/reject。
// accept → (pool-offer, offer)；reject → (0, 0)。
// =============================================================================
export interface UltimatumHooks {
  onOffer?: (offer: number) => void;
  onRespond?: (accepted: boolean, responderPayoff: number) => void;
  onConclude?: (rowPayoff: number, colPayoff: number) => void;
}

export interface UltimatumResult {
  accepted: boolean;
  proposerPayoff: number;
  responderPayoff: number;
}

export function gameUltimatum(
  pool: number,
  offer: number,
  threshold: number,
  hooks: UltimatumHooks = {},
): UltimatumResult {
  hooks.onOffer?.(offer);
  const accepted = offer >= threshold;
  hooks.onRespond?.(accepted, accepted ? offer : 0);
  const proposerPayoff = accepted ? pool - offer : 0;
  const responderPayoff = accepted ? offer : 0;
  hooks.onConclude?.(proposerPayoff, responderPayoff);
  return { accepted, proposerPayoff, responderPayoff };
}
