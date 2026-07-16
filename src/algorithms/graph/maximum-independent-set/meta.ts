import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'maximum-independent-set',
  categoryId: 'graph',
  title: { zh: '最大独立集', en: 'Maximum Independent Set' },
  summary: {
    zh: '分支定界：按顶点「取/不取」二分递归，上界剪枝。',
    en: 'Branch and bound: split on include/exclude of a vertex, prune by upper bound.',
  },
  description: {
    zh: '独立集是图中两两不相邻的顶点集合；最大独立集求顶点数最多的独立集，是 NP 困难问题（等价于补图最大团）。本实现用分支定界：每次选剩余中度数最大的顶点 v，分「不取 v」与「取 v（同时移除其所有邻居）」两支递归；上界 = 已选数 + 剩余数，小于当前最优即剪枝。最坏指数级。',
    en: 'An independent set is a set of pairwise non-adjacent vertices; finding the largest is NP-hard (equivalent to max clique on the complement). This branch-and-bound picks the highest-degree remaining vertex v and recurses on exclude-v vs include-v (removing neighbors); the bound chosen + remaining prunes inferior branches. Worst-case exponential.',
  },
  tags: ['graph', 'independent-set', 'branch-and-bound', 'np-hard'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
