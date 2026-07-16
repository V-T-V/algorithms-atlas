// Gusfield Gomory-Hu 树 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-gomory-hu-2',
  categoryId: 'network',
  title: { zh: 'Gusfield 全局最小割树', en: 'Gusfield Gomory-Hu Tree' },
  summary: {
    zh: '用 Gusfield 算法（无需节点收缩）构造 Gomory-Hu 树，支持任意节点对最小割查询。',
    en: "Build a Gomory-Hu tree via Gusfield's algorithm (no node contraction), enabling arbitrary pairwise min-cut queries.",
  },
  description: {
    zh: 'Gusfield 变体：不收缩节点，初始每个节点父为 0（根）。对每个 i=1..n−1，在「融合」后的图上对 (i, parent[i]) 跑最大流得到最小割 f_i，置边权 f_i，并按割侧更新某些节点的 parent。共 n−1 次最大流。查询任意 s-t 最小割 = 树上 s-t 路径最小边权。',
    en: "Gusfield's variant avoids node contraction: initialize each node's parent to 0 (root). For each i=1..n-1, run max flow on the fused graph between (i, parent[i]) to get min cut f_i, set edge weight f_i, and relabel some nodes' parents by cut side. Uses n-1 max flows total. Querying any s-t min cut = the minimum edge on the s-t path in the tree.",
  },
  tags: ['network', 'gomory-hu', 'min-cut', 'all-pairs', 'gusfield'],
  complexity: { time: 'O(V·maxflow)', space: 'O(V²)' },
};
