// 连通分量 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-connected-components',
  categoryId: 'network',
  title: { zh: '连通分量', en: 'Connected Components' },
  summary: { zh: '求无向图连通分量数。', en: 'Count connected components in an undirected graph.' },
  description: {
    zh: '对每个未访问节点跑 DFS/BFS。',
    en: 'Run DFS from each unvisited node. O(V+E).',
  },
  tags: ['network', 'graph', 'components'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
