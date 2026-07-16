// CTW（Context Tree Weighting）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-ctw',
  categoryId: 'compression',
  title: { zh: 'CTW', en: 'Context Tree Weighting' },
  summary: {
    zh: 'CTW：上下文树加权，二阶上下文最优混合。',
    en: 'CTW: context tree weighting, provably optimal for binary trees.',
  },
  description: {
    zh: 'CTW（Willems 等）用二叉上下文树对每条路径的 Krichevsky-Trofimov 估计做对数加权混合，对二阶马尔可夫源渐近最优。',
    en: 'CTW (Willems et al.) uses a binary context tree, blending Krichevsky-Trofimov estimates per path with log-weighting; asymptotically optimal for binary Markov sources.',
  },
  tags: ['compression', 'ctw', 'context-tree', 'binary'],
  complexity: { time: 'O(n·d)', space: 'O(2^d)' },
};
