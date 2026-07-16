// 二分图判断 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-is-bipartite',
  categoryId: 'network',
  title: { zh: '二分图判断', en: 'Is Bipartite' },
  summary: { zh: 'BFS 染色法判断二分图。', en: 'BFS two-coloring to test bipartiteness.' },
  description: {
    zh: '交替染 0/1；遇到同色邻居则非二分图。',
    en: 'Alternate colors; same-color neighbor => not bipartite. O(V+E).',
  },
  tags: ['network', 'graph', 'bipartite'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
