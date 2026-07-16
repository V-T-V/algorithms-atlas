// 硬币找零（贪心） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-coin-greedy',
  categoryId: 'greedy',
  title: { zh: '硬币找零（贪心）', en: 'Coin Change (Greedy)' },
  summary: {
    zh: '按面额降序每次尽量取最大硬币；仅对规范币系保证最优。',
    en: 'Take as many of the largest denomination as possible; optimal only for canonical systems.',
  },
  description: {
    zh: '硬币找零贪心：按面额降序，每次尽可能多地用最大面额。对 (1,5,10,25) 等规范币系最优，对一般币系未必。',
    en: 'Coin change greedy: use the largest denomination as much as possible each step. Optimal for canonical systems like (1,5,10,25), not in general.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
