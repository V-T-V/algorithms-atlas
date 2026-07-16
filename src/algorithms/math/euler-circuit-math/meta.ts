import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler-circuit-math',
  categoryId: 'math',
  title: { zh: '欧拉回路判定（数学）', en: 'Euler Circuit Existence (Math)' },
  summary: {
    zh: '仅判定存在性：连通 + 度数（无向偶度/有向平衡）。',
    en: 'Existence only: connected plus degree (even / balanced) conditions.',
  },
  description: {
    zh: '本算法不构造欧拉回路，只判定其存在性，是图论中的经典定理：无向图存在欧拉回路当且仅当「所有有边的点构成一个连通分量」且「每个非孤立点的度数均为偶数」；有向图当且仅当「弱连通」且「每个顶点的入度等于出度」。先用一次 DFS/BFS 验证连通性（忽略孤立点），再遍历度数。时间 O(V+E)。',
    en: 'This algorithm only decides existence of an Eulerian circuit without constructing it, via the classical theorem: an undirected graph has an Eulerian circuit iff all edge-bearing vertices form one connected component and every non-isolated vertex has even degree; a directed graph iff weakly connected with in-degree = out-degree at every vertex. A single DFS/BFS checks connectivity (ignoring isolated vertices), then degrees are scanned. Time O(V+E).',
  },
  tags: ['math', 'graph-theory', 'euler', 'existence', 'degree'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
