// 克隆图 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-clone-graph',
  categoryId: 'network',
  title: { zh: '克隆图', en: 'Clone Graph' },
  summary: {
    zh: '深拷贝无向图节点（带邻居）。',
    en: 'Deep-copy an undirected graph node with neighbors.',
  },
  description: { zh: 'BFS/DFS + Map 记录已克隆节点。', en: 'BFS + map of cloned nodes. O(V+E).' },
  tags: ['network', 'graph', 'clone'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
