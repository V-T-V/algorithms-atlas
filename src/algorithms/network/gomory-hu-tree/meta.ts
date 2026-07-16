// Gomory-Hu 树（全局最小割树）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gomory-hu-tree',
  categoryId: 'network',
  title: { zh: 'Gomory-Hu 树', en: 'Gomory-Hu Tree' },
  summary: {
    zh: '用 V-1 次最大流构造一棵树，树上每对节点的瓶颈即原图最小割容量。',
    en: 'Build a tree in V-1 max-flow calls whose path bottleneck gives the original min-cut between any pair.',
  },
  description: {
    zh: 'Gomory-Hu 树（割树）是一棵带边权的树 T，使得对无向图中任意两点 s、t，原图中 s-t 最小割的容量等于 T 上 s 到 t 路径上的「最小权边」。\n\n**构造算法**（Hu 1961）：\n1. 初始所有点放在同一个集合，父数组 parent[v] = 一个固定根。\n2. 对每个非根点 v，在其「组」内取父 p = parent[v]，在「压缩图」上跑一次 s=p, t=v 的最大流得到割 (S, T)，把流量 f 作为树边 (p, v, f)。\n3. 对组内其他点 w：若 w 落在割的 S 侧（与 p 同侧），则把 parent[w] 设为 v；否则保持。\n4. 重复直到所有点的 parent 都确定，得到 V-1 条树边。\n\n本实现为「简化版」：直接对每个非根点跑一次「p-v 最大流」，边权 = 该流量。共 V-1 次最大流（O(V) 次），总复杂度 O(V)·MF。求出后任意两点最小割 = 树路径瓶颈。',
    en: 'A Gomory-Hu tree (cut tree) is a weighted tree T such that for any two vertices s, t in the original undirected graph, the value of the minimum s-t cut equals the minimum-weight edge on the s→t path in T.\n\n**Construction** (Hu 1961):\n1. Start with all vertices in one group; pick parent[v] = a fixed root.\n2. For each non-root v, take p = parent[v] in its group, run a max-flow between s=p, t=v on the contracted graph; the flow f becomes tree edge (p, v, f).\n3. For every other w in the group: if w is on the S-side (with p), set parent[w] = v; else leave it.\n4. Repeat until all parents are determined, yielding V-1 tree edges.\n\nThis implementation is a "simplified version": directly run a p-v max-flow for each non-root vertex with edge weight = that flow. V-1 max-flow calls in total; overall O(V)·MF. Afterward any pair\'s min-cut = the path bottleneck in the tree.',
  },
  tags: ['network', 'min-cut', 'gomory-hu', 'all-pairs', 'tree'],
  complexity: { time: 'O(V)·MF(n,E)', space: 'O(V²)' },
};
