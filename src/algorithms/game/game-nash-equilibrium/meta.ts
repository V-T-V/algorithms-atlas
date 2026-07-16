// 混合纳什均衡 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-nash-equilibrium',
  categoryId: 'game',
  title: { zh: '混合策略纳什均衡', en: 'Mixed-Strategy Nash Equilibrium' },
  summary: {
    zh: '对 2x2 双矩阵博弈求解混合策略纳什：使对手在两纯策略间无差异。',
    en: 'Solve the mixed-strategy Nash of a 2x2 bimatrix game: make the opponent indifferent between pure strategies.',
  },
  description: {
    zh: '对 2x2 博弈，行玩家以概率 p 选第一行，使列玩家两列期望相等；列玩家以概率 q 选第一列，使行玩家两行期望相等。本实现返回 (p, q) 与博弈值。',
    en: 'For 2x2 games, row plays row-0 with probability p making column indifferent; column plays col-0 with q making row indifferent. Returns (p, q) and expected values.',
  },
  tags: ['game', 'game-theory', 'nash'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
