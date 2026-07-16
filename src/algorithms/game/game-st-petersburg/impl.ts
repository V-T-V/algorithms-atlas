// 圣彼得堡悖论 · 实现
export interface StPetHooks {
  onRound?: (n: number, prize: number, prob: number, contrib: number) => void;
  onConclude?: (ev: number, logUtil: number) => void;
}
export function stPetersburg(
  maxN: number,
  hooks: StPetHooks = {},
): { ev: number; logUtil: number } {
  let ev = 0,
    logUtil = 0;
  for (let n = 1; n <= maxN; n++) {
    const prize = Math.pow(2, n);
    const prob = Math.pow(0.5, n);
    const contrib = prize * prob;
    ev += contrib;
    logUtil += prob * Math.log2(prize);
    hooks.onRound?.(n, prize, prob, contrib);
  }
  hooks.onConclude?.(ev, logUtil);
  return { ev, logUtil };
}
