// 树策略 (Tree Policy) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-tree-policy',
  categoryId: 'ai-search',
  title: { zh: 'MCTS 树策略 (Tree Policy)', en: 'MCTS Tree Policy' },
  summary: {
    zh: 'MCTS 选择+扩展阶段：从根沿 UCB1 向下走到未 fully-expanded 或终局节点。',
    en: 'MCTS selection + expansion phase: descend from the root via UCB1 until reaching a not-fully-expanded or terminal node.',
  },
  description: {
    zh: '树策略（Tree Policy）是 MCTS 的前两个阶段：从根节点开始，若当前节点有未尝试动作则扩展（Expansion）一个新子节点；否则用 UCB1 选择最优子节点继续下降，直到到达终局或可扩展节点。UCB1 = wins/visits + c·√(ln(N)/visits)，平衡利用与探索。本实现提供独立的树策略函数，可作用于任意带 visits/wins/untried 的节点结构。',
    en: 'The Tree Policy covers the first two MCTS phases: starting from the root, if the current node has untried actions, expand one new child (Expansion); otherwise select the best child via UCB1 and descend, until reaching a terminal or expandable node. UCB1 = wins/visits + c·√(ln(N)/visits) balances exploitation and exploration. This implementation provides a standalone tree-policy function on any node structure with visits/wins/untried fields.',
  },
  tags: ['ai-search', 'mcts', 'tree-policy', 'ucb1', 'selection'],
  complexity: { time: 'O(d·b)', space: 'O(d)' },
};
