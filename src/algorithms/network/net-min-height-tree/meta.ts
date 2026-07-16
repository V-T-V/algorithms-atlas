// 最小高度树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-min-height-tree',
  categoryId: 'network',
  title: { zh: '最小高度树', en: 'Minimum Height Trees' },
  summary: {
    zh: '找树图的中心节点（作为根时高度最小）。',
    en: 'Find centroid nodes of a tree (minimal height roots).',
  },
  description: {
    zh: '不断剥离叶子，最后剩 1-2 个节点即中心。',
    en: 'Peel leaves layer by layer. O(V+E).',
  },
  tags: ['network', 'graph', 'topology'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
