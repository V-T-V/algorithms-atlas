// 割点Tarjan · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-articulation',
  categoryId: 'network',
  title: { zh: '割点Tarjan', en: 'Articulation Points (Tarjan)' },
  summary: { zh: 'Tarjan 算法求无向图割点。', en: 'Tarjan algorithm for articulation points.' },
  description: {
    zh: 'DFS 记录 disc/low；根有≥2 子树或非根 low[child]≥disc[u] 则为割点。',
    en: 'DFS with disc/low; root with 2+ children or low[child]>=disc[u]. O(V+E).',
  },
  tags: ['network', 'graph', 'articulation'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
