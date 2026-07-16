import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-prim-3',
  categoryId: 'graph',
  title: { zh: 'Prim 最小生成树', en: 'Prim Minimum Spanning Tree' },
  summary: {
    zh: '从一个起点出发逐步扩张，每次选最小权边把新节点加入生成树。',
    en: 'Grow a tree from a source by repeatedly adding the lightest crossing edge.',
  },
  description: {
    zh: '维护一个已在树中的集合 S。对每条 (S, V-S) 的横切边，选权最小者把对应顶点纳入 S。优先队列实现 O(E log V)。',
    en: 'Maintain set S of tree vertices; each step pick the lightest edge crossing (S, V-S) and absorb its endpoint.',
  },
  tags: ['graph', 'mst', 'greedy'],
  complexity: { time: 'O(E log V)', space: 'O(V)' },
};
