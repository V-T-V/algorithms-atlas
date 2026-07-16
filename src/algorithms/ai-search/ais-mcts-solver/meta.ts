// MCTS 求解器 (Solver) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-mcts-solver',
  categoryId: 'ai-search',
  title: { zh: 'MCTS 求解器 (证明数搜索)', en: 'MCTS Solver (Proof-Number)' },
  summary: {
    zh: 'PN-MCTS：rollout 终局为确定胜负时，把节点标记为已证胜/负，剪枝加速。',
    en: 'PN-MCTS: when a rollout reaches a definite win/loss, mark nodes proven, pruning to speed up solving.',
  },
  description: {
    zh: 'MCTS Solver（如 WIN/LOSS 标记版）在 rollout 返回确定胜负（而非连续奖励）时增强：若某节点已证明必胜（PROVEN_WIN）或必败（PROVEN_LOSS），不再扩展它。一个节点的证明值由子节点传播：任一子节点 PROVEN_WIN 则父 PROVEN_WIN（OR 节点）；所有子 PROVEN_LOSS 则父 PROVEN_LOSS。这把 MCTS 变为「求解」而非「估计」，能在有限搜索中确定游戏理论值。',
    en: 'The MCTS Solver (e.g. WIN/LOSS marking variant) enhances MCTS when rollouts return definite win/loss rather than continuous rewards: a node proven to be a forced win (PROVEN_WIN) or loss (PROVEN_LOSS) is no longer expanded. A node proof value propagates from children: any child PROVEN_WIN makes the parent PROVEN_WIN (OR node); all children PROVEN_LOSS makes the parent PROVEN_LOSS. This turns MCTS into solving rather than estimating, determining game-theoretic values within finite search.',
  },
  tags: ['ai-search', 'mcts', 'solver', 'proof-number', 'game-solving'],
  complexity: { time: 'O(N·d)', space: 'O(N·b)' },
};
