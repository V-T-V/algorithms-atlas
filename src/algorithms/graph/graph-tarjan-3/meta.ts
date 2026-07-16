import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-tarjan-3',
  categoryId: 'graph',
  title: { zh: 'Tarjan 强连通分量', en: 'Tarjan Strongly Connected Components' },
  summary: {
    zh: '单次 DFS 求有向图所有强连通分量（SCC）。',
    en: 'Single DFS to find all strongly connected components of a directed graph.',
  },
  description: {
    zh: '维护 dfn（发现序）与 low（能回溯到的最早祖先）。若 low[u]==dfn[u]，则弹出栈直到 u 形成一个 SCC。时间 O(V+E)。',
    en: 'Track dfn (discovery) and low (lowest reachable ancestor). When low[u]==dfn[u], pop the stack until u to form one SCC. O(V+E).',
  },
  tags: ['graph', 'scc', 'tarjan'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
