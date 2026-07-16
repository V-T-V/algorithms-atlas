// 回传 (Backpropagation) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-backpropagate',
  categoryId: 'ai-search',
  title: { zh: 'MCTS 回传 (Backpropagation)', en: 'MCTS Backpropagation' },
  summary: {
    zh: 'MCTS 第四阶段：把 rollout 奖励沿父链回填到路径上每个节点的 visits/wins。',
    en: 'MCTS fourth phase: propagate the rollout reward up the parent chain, updating visits/wins on every node on the path.',
  },
  description: {
    zh: '回传（Backpropagation / Backup）是 MCTS 的第四阶段。rollout 得到奖励 r 后，从模拟起点沿父指针回到根，路径上每个节点：visits += 1，wins += r（或按玩家视角取反，双人零和博弈中交替符号）。这样统计量被累积，供下次树策略的 UCB1 使用。本实现提供通用回传函数，支持单人（同向）与双人（交替取反）两种奖励方式。',
    en: 'Backpropagation (Backup) is the fourth MCTS phase. After the rollout yields a reward r, walk from the simulation start up the parent chain to the root; for each node on the path increment visits by 1 and add r to wins (or negate by player perspective, alternating signs in two-player zero-sum games). These accumulated statistics drive the next tree-policys UCB1. This implementation provides a general backup supporting both single-player (same sign) and two-player (alternating sign) rewards.',
  },
  tags: ['ai-search', 'mcts', 'backpropagation', 'backup'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
