// 零和博弈框架 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-zero-sum',
  categoryId: 'game',
  title: { zh: '零和博弈框架', en: 'Zero-Sum Game Framework' },
  summary: {
    zh: '求两人零和矩阵博弈的纯策略鞍点（最优纯策略与博弈值）。',
    en: 'Find the pure-strategy saddle point (optimal pure strategies and value) of a two-player zero-sum matrix game.',
  },
  description: {
    zh: '行玩家最大化、列玩家最小化。若 maximin == minimin 则存在纯策略鞍点，否则需混合策略。',
    en: 'Row maximizes, column minimizes. If maximin equals minimax, a pure saddle point exists; otherwise mixed strategies are required.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(m·n)', space: 'O(1)' },
};
