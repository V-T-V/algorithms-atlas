// Star1 剪枝（Star1 Pruning）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'star1-pruning',
  categoryId: 'ai-search',
  title: { zh: 'Star1 剪枝', en: 'Star1 Pruning' },
  summary: {
    zh: '在期望搜索（expectimax 的 chance 节点）中用上下界快速剪掉不可能的子节点。',
    en: 'Prune unlikely children at chance nodes of expectimax using upper/lower value bounds.',
  },
  description: {
    zh: 'Star1 / Star2（Hauk et al., 2006）是把 α-β 思想推广到 **期望搜索（expectimax）** 的剪枝算法。expectimax 在「机会节点」对所有子节点取加权平均（概率权），而不是 min/max，因此普通的 α-β 不能直接剪枝。\n\n**Star1** 给每个机会节点的子节点估值加上「概率上下界」 `[l_i, u_i]`：\n- 累计 Ax（已展开子节点的加权和）+ 未展开子节点的最大可能贡献（Σ p_i · u_i）若 < α → 整个机会节点不可能 ≥ α，剪枝。\n- 累计 Ax + 未展开子节点的最小可能贡献（Σ p_i · l_i）若 > β → 不可能 ≤ β，剪枝。\n\n本实现在带概率分布的数值树上工作：叶子带 utility，chance 节点带 children + 概率数组。结果与精确 expectimax 一致。',
    en: 'Star1 / Star2 (Hauk et al., 2006) generalize alpha-beta pruning to **expectimax**. Expectimax takes a weighted average over children at chance nodes (with probability weights) rather than min/max, so plain alpha-beta does not apply directly.\n\n**Star1** attaches a probability bound `[l_i, u_i]` to each chance child:\n- If accumulated Ax (weighted sum of expanded children) + the largest possible contribution of unexpanded children (Σ p_i · u_i) < alpha → the chance node cannot reach alpha, prune.\n- If Ax + the smallest possible contribution (Σ p_i · l_i) > beta → cannot be <= beta, prune.\n\nThis implementation works on a numeric tree with probabilities at chance nodes; its result matches exact expectimax.',
  },
  tags: ['ai-search', 'game-tree', 'expectimax', 'pruning', 'chance-node'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    { label: '*-Minimax / Star1 — Wikipedia', url: 'https://en.wikipedia.org/wiki/Expectiminimax' },
  ],
};
