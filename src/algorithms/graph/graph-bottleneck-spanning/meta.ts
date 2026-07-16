import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bottleneck-spanning',
  categoryId: 'graph',
  title: { zh: '瓶颈生成树', en: 'Bottleneck Spanning Tree' },
  summary: {
    zh: '最小化生成树中最大边权（MBST），等价于 MST 的瓶颈。',
    en: 'Minimize the maximum edge weight in a spanning tree (MBST); equals the MST bottleneck.',
  },
  description: {
    zh: '瓶颈生成树（Minimum Bottleneck Spanning Tree, MBST）：在所有生成树中，使「最大边权」最小的那棵。重要性质：任何一棵 MST 都是 MBST（反之不一定）。故可用 Kruskal/Prim 求 MST，再取其最大边即得瓶颈值；也可二分答案。本实现 Kruskal 求 MST 后返回最大边权。时间 O(E log E)，空间 O(V)。',
    en: 'MBST minimizes the max edge weight in a spanning tree. Key: every MST is an MBST. Kruskal then report the max edge. Time O(E log E), space O(V).',
  },
  tags: ['graph', 'spanning-tree', 'bottleneck', 'mst', 'minimax'],
  complexity: { time: 'O(E log E)', space: 'O(V)' },
};
