import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'steiner-tree',
  categoryId: 'graph',
  title: { zh: '斯坦纳树', en: 'Steiner Tree' },
  summary: {
    zh: 'Dreyfus-Wagner DP：连接给定终点集的最小权子树。',
    en: 'Dreyfus-Wagner DP for the min-weight subtree spanning given terminals.',
  },
  description: {
    zh: '斯坦纳树问题：给定无向带权图和一组「必经终点」，求一棵连接所有终点的最小权子树（允许使用非终点作为中转）。问题是 NP 困难，但当终点数 k 较小时可用 Dreyfus-Wagner 动态规划在 O(3^k·n + 2^k·n²) 内精确求解。状态 dp[S][v] 表示以 v 为根、连接终点子集 S 的最小子树代价，转移分「合并两个子集」与「沿最短路更换根」两类。',
    en: 'Given an undirected weighted graph and a set of terminals, the Steiner tree problem asks for the minimum-weight subtree spanning all terminals (non-terminals may serve as relays). It is NP-hard, but with a small number k of terminals the Dreyfus-Wagner DP solves it exactly in O(3^k·n + 2^k·n²). State dp[S][v] is the min cost of a subtree rooted at v spanning terminal subset S, with combine and root-move transitions.',
  },
  tags: ['graph', 'steiner-tree', 'dynamic-programming', 'np-hard', 'bitmask'],
  complexity: { time: 'O(3^k·n + 2^k·n²)', space: 'O(2^k·n)' },
};
