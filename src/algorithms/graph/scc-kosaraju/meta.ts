// Kosaraju SCC · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'scc-kosaraju',
  categoryId: 'graph',
  title: { zh: 'Kosaraju 强连通', en: 'Kosaraju SCC' },
  summary: {
    zh: '两遍 DFS 求有向图强连通分量：原图求完成序，反图按序摘树。',
    en: 'Two-pass DFS for SCC: finish order on G, then DFS on reversed G.',
  },
  description: {
    zh: 'Kosaraju 算法用两遍 DFS 求出有向图的所有强连通分量（SCC）。第一遍在原图上 DFS，按节点结束顺序入栈；第二遍在反图（所有边反向）上，依次弹出栈顶节点作为根进行 DFS，每棵 DFS 树的节点集合就是一个 SCC。时间复杂度 O(V+E)。',
    en: 'Kosaraju computes all strongly connected components of a directed graph with two DFS passes. The first pass runs DFS on G and pushes vertices onto a stack in finish order. The second pass pops vertices from the stack and runs DFS on the reversed graph; each DFS tree is one SCC. Time O(V+E).',
  },
  tags: ['graph', 'scc', 'dfs', 'strongly-connected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
