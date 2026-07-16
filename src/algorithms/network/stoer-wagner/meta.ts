// Stoer-Wagner 全局最小割 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stoer-wagner',
  categoryId: 'network',
  title: { zh: 'Stoer-Wagner 全局最小割', en: 'Stoer-Wagner Global Min-Cut' },
  summary: {
    zh: '通过 n-1 次「最大相邻序」收缩求无向加权图的全局最小割，O(V³)。',
    en: 'Contract via maximum-adjacency ordering n-1 times to get the global min-cut; O(V³).',
  },
  description: {
    zh: 'Stoer-Wagner 算法求无向加权（正权）图的**全局最小割**（把点集分成两份，跨边权和最小的切法）。\n\n核心引理（最大相邻序 MAO）：任选起点，每次把「与已选集 A 的边权和最大」的未选点加入 A；最后加入的两点记 (s, t)，则「s-t 最小割」要么等于本次 MAO 收缩的割值 w(A→t)，要么 s、t 同侧（可合并而不影响全局最优）。\n\n流程：\n1. 重复 n-1 次：跑一次 MAO 得到 (s, t) 与本轮割 w；记录 min(w)。\n2. 合并 s、t（边权相加），节点数减一。\n3. 全局最小割 = 各轮 w 的最小值。\n\n朴素邻接矩阵实现 `O(V³)`，空间 `O(V²)`。',
    en: 'Stoer-Wagner finds the **global minimum cut** of an undirected, positively-weighted graph (splitting vertices into two parts minimizing the cross-edge weight).\n\nKey lemma (Maximum Adjacency Ordering, MAO): pick any start, repeatedly add the unselected vertex with the largest total edge weight to the selected set A; the last two added (s, t) satisfy: the "s-t min-cut" equals this phase\'s MAO cut w(A→t), or s and t are on the same side (merging them preserves the global optimum).\n\nProcedure:\n1. Repeat n-1 times: run MAO to get (s, t) and phase cut w; track min(w).\n2. Merge s into t (summing edge weights); reduce vertex count by one.\n3. Global min-cut = min of all phase cuts.\n\nNaive adjacency-matrix implementation `O(V³)`, space `O(V²)`.',
  },
  tags: ['network', 'min-cut', 'graph', 'greedy'],
  complexity: { time: 'O(V³)', space: 'O(V²)' },
};
