import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-scc-3',
  categoryId: 'graph',
  title: { zh: 'Kosaraju 强连通分量', en: 'Kosaraju Strongly Connected Components' },
  summary: {
    zh: '两遍 DFS 求有向图 SCC：先正图求后序，再反图按倒序访问。',
    en: 'Two-pass DFS: first on the graph to get finish order, then on the reverse graph in reverse finish order.',
  },
  description: {
    zh: '1) 在原图 DFS 得到顶点完成顺序栈；2) 在反图上按完成序倒序遍历，每次 DFS 经过的所有顶点构成一个 SCC。',
    en: '1) DFS original graph to compute finish-order stack. 2) DFS reverse graph popping from the stack; each DFS tree is one SCC.',
  },
  tags: ['graph', 'scc', 'kosaraju'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
