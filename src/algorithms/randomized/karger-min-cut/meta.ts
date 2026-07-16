// Karger Min-Cut · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'karger-min-cut',
  categoryId: 'randomized',
  title: { zh: 'Karger 随机化最小割', en: 'Karger Randomized Min-Cut' },
  summary: {
    zh: '反复随机收缩边直至剩 2 个顶点，估计无向图的最小割。',
    en: 'Repeatedly contract random edges until 2 vertices remain to estimate a min cut.',
  },
  description: {
    zh: 'Karger 全局最小割算法是一种蒙特卡洛随机化算法。核心思想：在无向连通图中，每次等概率随机选一条边并将其两端合并为一个「超顶点」（收缩），删除自环。当只剩 2 个超顶点时，它们之间剩余的边数即为一次试验的割大小。\n\n单次试验正确概率较低（≈ 2/n²），但重复 n² 次（或更多）取最小值，正确概率可提升到任意接近 1。配合 Karger-Stein 优化可达 O(n² log³ n)。本实现用固定种子的 LCG 保证可复现，适合演示与单测。\n\n用并查集（DSU）跟踪收缩后的顶点等价类，用邻接表维护边集。',
    en: "Karger's global minimum cut algorithm is a Monte-Carlo randomized method. The idea: in an undirected connected graph, repeatedly pick a random edge uniformly and contract its endpoints into one super-vertex (removing self-loops). When only 2 super-vertices remain, the number of remaining edges between them is the cut size for that trial.\n\nA single trial succeeds with low probability (≈ 2/n²), but repeating n² times (or more) and taking the minimum raises the success probability arbitrarily close to 1. With the Karger-Stein refinement this reaches O(n² log³ n). This implementation uses a seeded LCG for reproducibility, suitable for demos and tests.\n\nA disjoint-set union (DSU) tracks the contracted equivalence classes and an adjacency list keeps the edge multiset.",
  },
  tags: ['randomized', 'graph', 'min-cut', 'monte-carlo'],
  complexity: { time: 'O(n²m) for n² trials', space: 'O(n + m)' },
};
