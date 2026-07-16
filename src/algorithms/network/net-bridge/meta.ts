// 桥Tarjan · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-bridge',
  categoryId: 'network',
  title: { zh: '桥Tarjan', en: 'Bridges (Tarjan)' },
  summary: { zh: 'Tarjan 算法求无向图桥。', en: 'Tarjan algorithm for bridges.' },
  description: {
    zh: 'DFS：low[child] > disc[u] 则 (u,child) 是桥。',
    en: 'low[child] > disc[u] => bridge. O(V+E).',
  },
  tags: ['network', 'graph', 'bridge'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
