// 图贪心染色 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-color-sort-graph',
  categoryId: 'network',
  title: { zh: '图贪心染色', en: 'Graph Greedy Coloring' },
  summary: { zh: '贪心给图节点着色（相邻不同色）。', en: 'Greedy vertex coloring.' },
  description: {
    zh: '按顺序，每个节点用最小可用色。',
    en: 'Use smallest available color per node. O(V+E).',
  },
  tags: ['network', 'graph', 'coloring'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
