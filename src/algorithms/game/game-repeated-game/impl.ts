// 重复博弈 · 实现（囚徒困境阶段，Tit-for-Tat vs AllD）
export type Strategy = (oppLastMove: 'C' | 'D' | null) => 'C' | 'D';
export interface RepeatedGameHooks {
  onRound?: (round: number, a1: 'C' | 'D', a2: 'C' | 'D', u1: number, u2: number) => void;
  onConclude?: (totalU1: number, totalU2: number) => void;
}
export interface RepeatedGameResult {
  totalU1: number;
  totalU2: number;
  history: Array<{ a1: 'C' | 'D'; a2: 'C' | 'D' }>;
}
export const TIT_FOR_TAT: Strategy = (opp) => (opp === null ? 'C' : opp);
export const ALWAYS_DEFECT: Strategy = () => 'D';
export const ALWAYS_COOPERATE: Strategy = () => 'C';
// PD 收益：T=5, R=3, P=1, S=0
const PD: Record<string, [number, number]> = {
  CC: [3, 3],
  CD: [0, 5],
  DC: [5, 0],
  DD: [1, 1],
};
export function gameRepeatedGame(
  s1: Strategy,
  s2: Strategy,
  rounds: number,
  hooks: RepeatedGameHooks = {},
): RepeatedGameResult {
  let last1: 'C' | 'D' | null = null;
  let last2: 'C' | 'D' | null = null;
  let totalU1 = 0;
  let totalU2 = 0;
  const history: Array<{ a1: 'C' | 'D'; a2: 'C' | 'D' }> = [];
  for (let r = 1; r <= rounds; r++) {
    const a1 = s1(last2);
    const a2 = s2(last1);
    const [u1, u2] = PD[`${a1}${a2}`]!;
    totalU1 += u1;
    totalU2 += u2;
    history.push({ a1, a2 });
    hooks.onRound?.(r, a1, a2, u1, u2);
    last1 = a1;
    last2 = a2;
  }
  hooks.onConclude?.(totalU1, totalU2);
  return { totalU1, totalU2, history };
}
