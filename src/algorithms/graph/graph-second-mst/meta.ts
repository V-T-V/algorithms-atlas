import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-second-mst',
  categoryId: 'graph',
  title: { zh: '次小生成树', en: 'Second Best Minimum Spanning Tree' },
  summary: {
    zh: '严格次小生成树：在所有生成树中权值第二小的。',
    en: 'Strict second-best spanning tree: the second-smallest total weight among all spanning trees.',
  },
  description: {
    zh: '次小生成树（严格次小）。先求 MST T；对每条不在 T 中的边 e=(u,v,w)，加入 T 会形成环，需删除环上权值最大的边 m（若 m==w 则删次大）；这样得到一棵新树，权值 = MST + (w - m)。枚举所有非树边取最小增量，得严格次小。本实现用朴素法：对每条非树边，BFS 找路径上最大边。时间 O(E·V)，空间 O(V)。',
    en: 'Strict second-best MST. Build MST T; for each non-tree edge (u,v,w), adding it forms a cycle — remove the max edge on the u-v path in T (or second-max if equal). Min over increments. Time O(E·V), space O(V).',
  },
  tags: ['graph', 'mst', 'spanning-tree', 'second-best'],
  complexity: { time: 'O(E·V)', space: 'O(V)' },
};
