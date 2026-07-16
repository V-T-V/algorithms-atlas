import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-min-gen-tree-2',
  categoryId: 'graph',
  title: { zh: '最小生成树（Prim）', en: 'Minimum Spanning Tree (Prim)' },
  summary: {
    zh: 'Prim 算法从一个起点不断加入最短横切边构造 MST。',
    en: 'Prim grows an MST from a start by repeatedly adding the shortest crossing edge.',
  },
  description: {
    zh: 'Prim 最小生成树算法。从任一顶点开始，维护已选集合 S；每步从连接 S 与 V\S 的所有边（横切边）中选权值最小的一条，将其另一端加入 S。重复 V-1 次。本实现用朴素 O(V²) 选最小 key（适合稠密图）。时间 O(V²)（朴素）/ O(E log V)（堆优化），空间 O(V)。',
    en: 'Prim MST: from a start, repeatedly add the shortest edge crossing the cut between chosen set and the rest. Naive O(V²). Time O(V²), space O(V).',
  },
  tags: ['graph', 'mst', 'prim', 'greedy', 'spanning-tree'],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
