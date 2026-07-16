// 贪心最大割（Greedy Max Cut）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-max-cut',
  categoryId: 'greedy',
  title: { zh: '贪心最大割', en: 'Greedy Max Cut' },
  summary: {
    zh: '把顶点分到两侧使跨越边数最大，贪心按当前贡献放置。',
    en: 'Split vertices into two sides maximizing crossing edges; place each by current contribution.',
  },
  description: {
    zh: '贪心最大割：按顶点序，每个顶点放入能增加更多跨越边的侧。局部最优，近似比可分析。',
    en: 'Greedy max cut: process vertices in order, place each on the side increasing crossing edges. Local optimum.',
  },
  tags: ['greedy', 'graph', 'approximation'],
  complexity: { time: 'O(|V|+|E|)', space: 'O(|V|)' },
};
