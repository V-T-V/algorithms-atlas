import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-max-clique-2',
  categoryId: 'graph',
  title: { zh: '最大团（回溯）', en: 'Maximum Clique (Backtracking)' },
  summary: {
    zh: '回溯枚举所有团，求节点数最多的完全子图。',
    en: 'Backtrack over vertices to find the largest complete subgraph.',
  },
  description: {
    zh: '最大团问题（NP-hard）。给定无向图，求最大的完全子图（团）。回溯：以候选集 P 维护可扩展节点，逐步选入当前团 R；若 |R|+|P| 不超过已知最优则剪枝。找到极大团即更新最优。指数复杂度，适合小规模图（V≤50）。最坏 O(3^(V/3))（Bron-Kerbosch 上界）。',
    en: 'Maximum clique (NP-hard). Backtracking with pruning: maintain candidate set P; prune when |R|+|P| <= best. Worst O(3^(V/3)).',
  },
  tags: ['graph', 'clique', 'backtracking', 'np-hard'],
  complexity: { time: 'O(3^(V/3))', space: 'O(V)' },
};
