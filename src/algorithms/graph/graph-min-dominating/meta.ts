import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-min-dominating',
  categoryId: 'graph',
  title: { zh: '最小支配集（贪心近似）', en: 'Minimum Dominating Set (Greedy)' },
  summary: {
    zh: '贪心选「覆盖最多未支配节点」的节点，构造支配集。',
    en: 'Greedily pick vertices covering the most undominated vertices to build a dominating set.',
  },
  description: {
    zh: '最小支配集问题（NP-hard）。一个支配集 D 使每个节点要么在 D 中，要么有邻居在 D 中。贪心近似：每步选「能新支配最多未支配节点」的节点（含自身）加入 D，直到所有节点被支配。时间 O(V²)，空间 O(V)。',
    en: 'Minimum dominating set (NP-hard). Greedy: each step pick the vertex that newly dominates the most undominated vertices (including itself). Time O(V²), space O(V).',
  },
  tags: ['graph', 'dominating-set', 'greedy', 'approximation', 'np-hard'],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
