// 贪心二分匹配（Greedy Bipartite Matching）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-bipartite-max',
  categoryId: 'greedy',
  title: { zh: '贪心二分匹配', en: 'Greedy Bipartite Matching' },
  summary: {
    zh: '按边顺序贪心选不相交边，得到近似最大匹配。',
    en: 'Greedily pick non-conflicting edges in order for an approximate maximum matching.',
  },
  description: {
    zh: '贪心二分匹配：按边列表顺序，若两端点都未匹配则选入。所得匹配大小 ≥ OPT/2。',
    en: 'Greedy bipartite matching: scan edges in order, match both endpoints if free. Result size >= OPT/2.',
  },
  tags: ['greedy', 'bipartite', 'matching'],
  complexity: { time: 'O(|E|)', space: 'O(|V|)' },
};
