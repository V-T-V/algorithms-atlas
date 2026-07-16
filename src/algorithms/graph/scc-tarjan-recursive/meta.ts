// SCC Tarjan Recursive · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'scc-tarjan-recursive',
  categoryId: 'graph',
  title: { zh: '强连通分量·递归 Tarjan', en: 'SCC Tarjan Recursive' },
  summary: {
    zh: '递归版 Tarjan 算法求有向图的强连通分量。',
    en: 'Recursive Tarjan algorithm for strongly connected components.',
  },
  description: {
    zh: '对有向图做一次 DFS，维护每个节点的 dfn（发现时间戳）与 low（能回溯到的最早时间戳）。当 low[v] == dfn[v] 时，从栈中弹出节点直到 v，构成一个 SCC。递归实现简洁直观，但深度过大时可能栈溢出（迭代版见 scc-tarjan-iter）。时间 O(V+E)。',
    en: 'Single DFS over a directed graph, maintaining dfn (discovery time) and low (earliest reachable time). When low[v] == dfn[v], pop the stack down to v to form an SCC. Recursive form is concise but may stack overflow on very deep graphs (see scc-tarjan-iter for iterative). Time O(V+E).',
  },
  tags: ['graph', 'scc', 'tarjan', 'dfs', 'recursive'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
