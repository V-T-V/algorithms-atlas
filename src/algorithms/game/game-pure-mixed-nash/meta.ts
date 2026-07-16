// 混合策略纳什（Mixed Strategy Nash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-pure-mixed-nash',
  categoryId: 'game',
  title: { zh: '混合策略纳什', en: 'Mixed Strategy Nash' },
  summary: {
    zh: '2x2 零和博弈求混合纳什：行玩家最小化列玩家最大收益。',
    en: '2x2 zero-sum mixed Nash: row minimizes columns max payoff via von Neumann minimax.',
  },
  description: {
    zh: '对收益矩阵 A（行玩家），混合策略 p 使 min over q 的 pAq 最大化。2x2 解：p* 满足两列期望相等。',
    en: 'For payoff A (row player), mixed p maximizes min over q of pAq. 2x2 solution: p* equalizes both columns expected payoff.',
  },
  tags: ['game', 'game-theory', 'minimax'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
