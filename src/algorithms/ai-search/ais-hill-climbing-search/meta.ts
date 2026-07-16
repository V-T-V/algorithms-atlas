// 爬山搜索（Hill Climbing Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-hill-climbing-search',
  categoryId: 'ai-search',
  title: { zh: '爬山搜索', en: 'Hill Climbing Search' },
  summary: {
    zh: '贪心移向更优邻居，可能陷入局部最优。',
    en: 'Greedily move to a better neighbor; may get stuck in local optima.',
  },
  description: {
    zh: '爬山搜索是最简单的局部搜索：从当前点出发，评估邻居，移到值最优的邻居（若优于当前），否则停止。本实现在 1D 多峰地形上演示。',
    en: 'Hill climbing is the simplest local search: from the current point, evaluate neighbors and move to the best-valued neighbor if better than current; otherwise stop.',
  },
  tags: ['ai-search', 'local-search', 'optimization', 'hill-climbing'],
  complexity: { time: 'O(iter × k)', space: 'O(1)' },
};
