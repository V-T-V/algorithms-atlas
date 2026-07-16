// Prim最小生成树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-prim-mst',
  categoryId: 'network',
  title: { zh: 'Prim最小生成树', en: 'Prim MST' },
  summary: {
    zh: '贪心选最小权边扩展生成树。',
    en: 'Greedy MST by growing from a source with min edges.',
  },
  description: {
    zh: '从起点出发，每次把到树距离最小的节点加入。',
    en: 'Add nearest vertex each step. O(V^2).',
  },
  tags: ['network', 'graph', 'mst'],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
};
