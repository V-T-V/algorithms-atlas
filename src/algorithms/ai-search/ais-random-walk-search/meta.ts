// 随机游走搜索（Random Walk Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-random-walk-search',
  categoryId: 'ai-search',
  title: { zh: '随机游走搜索', en: 'Random Walk Search' },
  summary: { zh: '每步随机选邻居前进。', en: 'Randomly moves to a neighbor each step.' },
  description: {
    zh: '随机游走在状态空间每步随机选择一个邻居，是 CSP/CSP 局部搜索的基础对照，理论上以 1 概率命中目标。',
    en: 'Random walk picks a random neighbor each step; a baseline for local search that eventually hits any goal with probability 1.',
  },
  tags: ['ai-search', 'random-walk', 'local-search'],
  complexity: { time: 'O(steps)', space: 'O(1)' },
};
