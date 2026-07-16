// Stoer-Wagner 全局最小割（变种：带合并记录）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-min-cut-stoer-2',
  categoryId: 'network',
  title: {
    zh: 'Stoer-Wagner 全局最小割（带合并记录）',
    en: 'Stoer-Wagner Global Min-Cut (Merge-Tracking)',
  },
  summary: {
    zh: '用 Stoer-Wagner 算法求无向加权图的全局最小割，并记录每轮的顶点合并过程。',
    en: 'Compute the global minimum cut of an undirected weighted graph via Stoer-Wagner, recording each phase vertex merge.',
  },
  description: {
    zh: 'Stoer-Wagner 算法反复执行「最大相邻顶点收缩」：每轮用类似 Prim 的方式找出当前图的「最小割阶段」(s, t)，把 t 合并入 s，并记录「最后加入的两个点之间的割值」作为候选。所有阶段的最小候选即为全局最小割。本变种额外记录每轮合并的顶点对，便于可视化。时间复杂度 O(V³)。',
    en: 'Stoer-Wagner repeatedly performs a "maximum adjacency" contraction: each phase runs a Prim-like process to find the phase cut (s, t), merges t into s, and records the cut value between the last two added vertices as a candidate. The minimum over all phases is the global min-cut. This variant also records the merged vertex pair each phase for visualization. O(V³) time.',
  },
  tags: ['network', 'min-cut', 'stoer-wagner', 'undirected'],
  complexity: { time: 'O(V³)', space: 'O(V²)' },
};
