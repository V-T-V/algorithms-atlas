// 囚徒困境 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-prisoners-dilemma',
  categoryId: 'game',
  title: { zh: '囚徒困境', en: "Prisoner's Dilemma" },
  summary: {
    zh: '经典 2×2 博弈：双方都背叛是唯一纳什均衡，却劣于双方合作。',
    en: 'Classic 2x2: mutual defection is the unique Nash, yet pareto-dominated by mutual cooperation.',
  },
  description: {
    zh: '两名嫌犯各自选择合作(C)或背叛(D)。收益 T>R>P>S，唯一纳什均衡为 (D,D)，但 (C,C) 对双方更好。',
    en: 'Two suspects choose Cooperate(C) or Defect(D). Payoffs T>R>P>S; unique Nash is (D,D) though (C,C) is better for both.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
