// RAVE（Rapid Action Value Estimation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rave',
  categoryId: 'ai-search',
  title: { zh: 'RAVE 快速动作价值估计', en: 'Rapid Action Value Estimation (RAVE)' },
  summary: {
    zh: 'MCTS 的 AMAF 启发：用「此后出现的所有动作」共同估计某动作的价值，加速早期收敛。',
    en: "AMAF-style heuristic in MCTS: estimate a move's value using all moves that appear later, accelerating early convergence.",
  },
  description: {
    zh: 'RAVE（Gelly & Silver, 2007）源自 **AMAF**（All Moves As First）启发：在围棋等游戏中，某个动作 a 在树的某条分支上第一次出现后，如果它在后续 rollout 中再次出现，则把该 rollout 的结果也算作对 a 的「估计」——即便这次 a 出现在不同的位置。\n\nRAVE 值与 MCTS 值的融合公式：\n```\nvalue(s,a) = β(s) · Q_RAVE(s,a) + (1 - β(s)) · Q_MCTS(s,a)\nβ(s) = sqrt(K / (3·visits(s) + K))\n```\n访问次数少时（β≈1）偏重 RAVE 的快速估计；访问次数多时偏重 MCTS 的精确值。\n\n本实现在 K-臂问题上模拟 AMAF：rollout 中所有「臂」都被记入 AMAF 表，加速早期收敛。',
    en: "RAVE (Gelly & Silver, 2007) builds on the **AMAF** (All Moves As First) heuristic: in games like Go, once a move `a` appears for the first time along a branch, if it recurs in the subsequent rollout, the rollout result also counts as an estimate of `a` — even if the second appearance is at a different position.\n\nRAVE value blended with the MCTS value:\n```\nvalue(s,a) = β(s) · Q_RAVE(s,a) + (1 - β(s)) · Q_MCTS(s,a)\nβ(s) = sqrt(K / (3·visits(s) + K))\n```\nWith few visits (β≈1) we lean on RAVE's fast estimate; with many visits we trust the exact MCTS value.\n\nThis implementation simulates AMAF on a K-armed bandit: every arm seen in a rollout is recorded in the AMAF table, accelerating early convergence.",
  },
  tags: ['ai-search', 'mcts', 'amaf', 'rave', 'heuristic'],
  complexity: { time: 'O(iterations · depth)', space: 'O(actions²)' },
  references: [
    {
      label: 'RAVE — Gelly & Silver, 2007',
      url: 'https://link.springer.com/chapter/10.1007/978-3-540-75155-8_8',
    },
  ],
};
