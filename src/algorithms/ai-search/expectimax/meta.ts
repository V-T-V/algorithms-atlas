// 期望最大搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'expectimax',
  categoryId: 'ai-search',
  title: { zh: '期望最大搜索', en: 'Expectimax Search' },
  summary: {
    zh: '带随机节点的 minimax：MAX 取最大，机会节点取期望（加权平均）。',
    en: 'Minimax with chance nodes: MAX maximizes, chance nodes take the expected value.',
  },
  description: {
    zh: 'Expectimax 处理含随机性的博弈（如含骰子、2048、大富翁）。树上有两类非叶节点：MAX 节点取所有子节点的最大值；CHANCE 节点取所有子节点值的加权平均（权重 = 该随机结果概率）。它假设环境「按概率均匀/已知分布」行动，而不是像 minimax 那样假设对手最恶。本实现在显式标注节点类型的数值树上工作，演示一个 1-2-3 骰子的简单游戏。',
    en: 'Expectimax handles games with randomness (dice, 2048, Monopoly). Non-leaf nodes are of two kinds: MAX nodes take the max over children; CHANCE nodes take the probability-weighted average over children. It models the environment as sampling from a known distribution rather than a worst-case adversary. This implementation works on a numeric tree with explicit node kinds, demonstrating a simple 1-2-3 dice game.',
  },
  tags: ['ai-search', 'game-tree', 'stochastic', 'expectation'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    {
      label: 'Expectimax search — CS188 Berkeley',
      url: 'https://inst.eecs.berkeley.edu/~cs188/sp20/course-materials/notes/6-search/',
    },
  ],
};
