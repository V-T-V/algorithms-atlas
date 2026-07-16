// 强连通分量Kosaraju · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-strongly-connected',
  categoryId: 'network',
  title: { zh: '强连通分量Kosaraju', en: 'Strongly Connected (Kosaraju)' },
  summary: { zh: 'Kosaraju 算法求有向图强连通分量。', en: 'Kosaraju SCC on a directed graph.' },
  description: {
    zh: '一遍 DFS 记录完成序，反图按逆序再 DFS。',
    en: 'DFS finish order, then DFS on reversed graph. O(V+E).',
  },
  tags: ['network', 'graph', 'scc'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
