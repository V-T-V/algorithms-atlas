// 贪心最大权匹配（Greedy Maximum Weight Matching）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-weighted-matching',
  categoryId: 'greedy',
  title: { zh: '贪心最大权匹配', en: 'Greedy Maximum Weight Matching' },
  summary: {
    zh: '按权重降序选不相交边，近似最大权匹配。',
    en: 'Pick non-conflicting edges by descending weight for an approximate max-weight matching.',
  },
  description: {
    zh: '贪心最大权匹配：边按权重降序，依次选入两端未匹配的边。结果 ≥ OPT/2。',
    en: 'Greedy max-weight matching: edges sorted by weight desc, add if both endpoints free. Result >= OPT/2.',
  },
  tags: ['greedy', 'matching', 'graph'],
  complexity: { time: 'O(|E| log |E|)', space: 'O(|V|)' },
};
