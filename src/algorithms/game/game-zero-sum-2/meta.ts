// 零和矩阵博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-zero-sum-2',
  categoryId: 'game',
  title: { zh: '零和矩阵博弈', en: 'Zero-Sum Matrix Game' },
  summary: {
    zh: '行收益即列损失；纯策略纳什 = 鞍点（maximin=minimax）。',
    en: "Row's gain is column's loss; pure Nash = saddle (maximin=minimax).",
  },
  description: {
    zh: '零和博弈（鞍点示例）。行/列选策略 0 或 1。\n      0      1\n  0  4,−4   1,−1\n  1  2,−2   3,−3\n鞍点 (1,1)：maximin=2 == minimax=2，博弈值 2。',
    en: 'Zero-sum game (saddle example). Actions 0 or 1.\n      0      1\n  0  4,-4   1,-1\n  1  2,-2   3,-3\nSaddle (1,1): maximin=2 == minimax=2, value 2.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
