// 石子游戏 VII · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stone-game-7',
  categoryId: 'game',
  title: { zh: '石子游戏 VII', en: 'Stone Game VII' },
  summary: {
    zh: '区间 DP：轮流移除边缘石子，得分等于剩余石子和，两人都最大化分差。',
    en: 'Interval DP: alternately remove an edge stone, gain the remaining sum; both maximize the score difference.',
  },
  description: {
    zh: '每次移除最左或最右石子，得分为移除后剩余段之和。用区间 DP 求先手相对后手的最大分差。',
    en: 'Remove the leftmost or rightmost stone each turn; gain the sum of the remaining segment. Interval DP yields the max score difference.',
  },
  tags: ['game', 'dp', 'interval'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
