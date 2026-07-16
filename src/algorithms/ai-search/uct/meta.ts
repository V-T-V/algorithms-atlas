// UCT 选择策略 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'uct',
  categoryId: 'ai-search',
  title: { zh: 'UCT 选择策略', en: 'UCT Selection Policy' },
  summary: {
    zh: '把 UCB1 用于树节点选择：在利用（胜率）与探索（少见）间做最优权衡。',
    en: 'Applies UCB1 to tree-node selection, optimally balancing exploitation (win rate) and exploration (rarity).',
  },
  description: {
    zh: 'UCT（UCB1 applied to Trees）是 MCTS 在「选择」阶段的核心公式。对父节点下每个子节点 i，计算 UCB 值：winRate_i + C·sqrt(ln(N) / n_i)，其中 N = 父访问数，n_i = 子访问数，C 是探索常数（常取 √2）。第一项利用历史胜率，第二项鼓励探索访问次数少的节点。UCT 在数学上保证了「面对有限选项时累积遗憾增长最优」。本实现提供独立的 UCT 选择工具：uctValue(...) 计算单节点 UCB，UCT.selectBest(children, c) 返回最优子索引，可独立测试与可视化。',
    en: "UCT (UCB1 applied to Trees) is the core formula of MCTS's selection phase. For each child i of a parent, compute UCB = winRate_i + C·sqrt(ln(N)/n_i), where N is the parent's visits, n_i the child's visits, and C the exploration constant (often √2). The first term exploits historical win rate, the second encourages exploring rarely visited nodes. UCT gives a mathematically optimal regret bound over finite choices. This implementation provides standalone UCT tools: uctValue(...) computes one node's UCB, and UCT.selectBest(children, c) returns the best child index — independently testable and visualizable.",
  },
  tags: ['ai-search', 'mcts', 'multi-armed-bandit', 'ucb1'],
  complexity: { time: 'O(子节点数)', space: 'O(1)' },
  references: [
    {
      label: 'UCT — Kocsis & Szepesvári (2006)',
      url: 'https://link.springer.com/chapter/10.1007/11871842_29',
    },
  ],
};
