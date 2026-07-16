// AO* 与或图搜索（AO* Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-ao-star',
  categoryId: 'ai-search',
  title: { zh: 'AO* 与或图搜索', en: 'AO* Search' },
  summary: { zh: '在 AND-OR 图上求最优解图。', en: 'Optimal solution graph over AND-OR graphs.' },
  description: {
    zh: 'AO*(Nilsson)处理节点含「与」(须全部解决)和「或」(任一解决)连接的图，自顶向下扩展并回传代价。',
    en: 'AO* handles AND (all must be solved) and OR (any suffices) connectors, expanding top-down and propagating cost.',
  },
  tags: ['ai-search', 'ao-star', 'and-or-graph'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
