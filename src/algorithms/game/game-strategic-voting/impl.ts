// 策略性投票 · 实现 (plurality rule)
export interface VoteHooks {
  onTally?: (counts: number[]) => void;
  onOutcome?: (winner: number) => void;
}
export interface Voter {
  prefs: number[];
} // prefs[0] 最喜欢
export function strategicVoting(
  voters: readonly Voter[],
  m: number,
  hooks: VoteHooks = {},
): { sincere: number; strategic: number } {
  // 真诚投票：每人投 prefs[0]
  const cS = new Array<number>(m).fill(0);
  for (const v of voters) cS[v.prefs[0]!]!++;
  hooks.onTally?.(cS);
  let sincere = 0;
  for (let i = 1; i < m; i++) if (cS[i]! > cS[sincere]!) sincere = i;
  hooks.onOutcome?.(sincere);
  // 策略：若真诚赢家是某人 prefs 末位，他改投 prefs[0] 之外最可能赢的
  const cStrat = [...cS];
  for (const v of voters) {
    if (v.prefs[v.prefs.length - 1] === sincere) {
      // 找真诚第二能挑战的，简化：投 prefs[1]
      cStrat[v.prefs[0]!]!--;
      cStrat[v.prefs[1]!]!++;
    }
  }
  let strategic = 0;
  for (let i = 1; i < m; i++) if (cStrat[i]! > cStrat[strategic]!) strategic = i;
  return { sincere, strategic };
}
