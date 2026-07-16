// TD-Leaf 学习 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-td-leaf',
  categoryId: 'ai-search',
  title: { zh: 'TD-Leaf(λ) 棋局学习', en: 'TD-Leaf(λ) Game Learning' },
  summary: {
    zh: '把 TD(λ) 应用到 alpha-beta 主路径的叶子估值，自学评估函数权重。',
    en: 'Apply TD(λ) to the leaf evaluations along the alpha-beta principal variation to self-learn evaluation weights.',
  },
  description: {
    zh: 'TD-Leaf(λ)（Baxter, Tridgell, Weaver, 1998）是西洋跳棋程序 KnightCap 提出的强化学习方法。它沿 alpha-beta 搜索每步产生的「主路径」（principal variation）的叶子估值序列做 TD(λ) 学习：用相邻叶子的估值差作为时序差分信号，更新评估函数的权重向量 w。这样程序通过自我对弈不断提升评估精度。本实现演示对线性评估器 w·features 做 TD-Leaf 更新。',
    en: 'TD-Leaf(λ) (Baxter, Tridgell, Weaver, 1998) is the reinforcement-learning method behind the checkers program KnightCap. It applies TD(λ) learning to the sequence of leaf evaluations along the principal variation produced by alpha-beta search each move: the temporal-difference signal from consecutive leaf estimates updates the evaluation weight vector w. The program self-improves via self-play. This implementation demonstrates TD-Leaf updates on a linear evaluator w·features.',
  },
  tags: ['ai-search', 'reinforcement-learning', 'td-leaf', 'self-play', 'evaluation'],
  complexity: { time: 'O(T·f)', space: 'O(f)' },
};
