// 最大流二分匹配 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-bipartite-matching-2',
  categoryId: 'network',
  title: { zh: '最大流二分匹配', en: 'Max-Flow Bipartite Matching' },
  summary: {
    zh: '将二分图最大匹配归约为最大流：超级源连左部、左部连右部、右部连超级汇。',
    en: 'Reduce bipartite maximum matching to max flow: super-source to left, left to right, right to super-sink, all unit capacities.',
  },
  description: {
    zh: '二分图 G=(L∪R, E) 的最大匹配 = 对应流网络的最大流。构造：超级源 S 连 L 每点（容 1），E 中边 l→r（容 1），R 每点连超级汇 T（容 1）。由于所有边容 1，整数最大流即最大匹配。Ford-Fulkerson 在单位容量图上为 O(E·√V) 级。',
    en: 'The maximum matching of bipartite G=(L∪R,E) equals the max flow of a corresponding network: super-source S to each L node (cap 1), each edge l->r (cap 1), each R node to super-sink T (cap 1). Unit capacities yield an integral max flow equal to the maximum matching.',
  },
  tags: ['network', 'bipartite-matching', 'max-flow', 'reduction', 'unit-capacity'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};
