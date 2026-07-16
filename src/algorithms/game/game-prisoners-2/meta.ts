// 囚徒困境（变体） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-prisoners-2',
  categoryId: 'game',
  title: { zh: '囚徒困境（变体）', en: "Prisoner's Dilemma (variant)" },
  summary: {
    zh: 'T>R>P>S；唯一纯纳什 (D,D) 帕累托劣于 (C,C)。',
    en: 'T>R>P>S; unique pure Nash (D,D) is pareto-dominated by (C,C).',
  },
  description: {
    zh: '囚徒困境变体（用经典 T=5,R=3,P=1,S=0）。\n      C      D\n  C  3,3    0,5\n  D  5,0    1,1\n唯一纯纳什：(D,D)；社会最优 (C,C)。',
    en: "Prisoner's dilemma variant (T=5,R=3,P=1,S=0).\n      C      D\n  C  3,3    0,5\n  D  5,0    1,1\nUnique pure Nash: (D,D); social optimum (C,C).",
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
