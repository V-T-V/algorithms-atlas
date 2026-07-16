// 序贯条件概率搜索 (SCPS) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-scps',
  categoryId: 'ai-search',
  title: { zh: '序贯条件概率搜索 (SCPS)', en: 'Sequential Conditional Probability Search' },
  summary: {
    zh: '用条件概率对博弈树叶子估值，序贯更新信念，逼近期望效用。',
    en: 'Estimate game-tree leaves via conditional probabilities, updating beliefs sequentially to approximate expected utility.',
  },
  description: {
    zh: '序贯条件概率搜索（SCPS）在含不确定性的博弈中，用条件概率模型为叶子估值。对每个叶子的结果分布建模，沿树自底向上按概率加权聚合：MAX 节点取期望最大、MIN 节点取期望最小（或机会节点直接加权）。本实现演示在带概率叶子的树上做期望效用传播。',
    en: 'Sequential Conditional Probability Search (SCPS) models game-tree leaves with conditional probability distributions for games with uncertainty. It aggregates bottom-up by probability-weighted expectation: MAX nodes take the expected max, MIN nodes the expected min (chance nodes directly weight). This implementation demonstrates expected-utility propagation on a tree with probabilistic leaves.',
  },
  tags: ['ai-search', 'probability', 'expectimax', 'uncertainty'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};
