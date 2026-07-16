// 纯蒙特卡洛模拟 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monte-carlo-rollout',
  categoryId: 'ai-search',
  title: { zh: '纯蒙特卡洛模拟', en: 'Monte Carlo Rollout' },
  summary: {
    zh: '从某局面用固定种子随机模拟到终局，统计胜负，估计局面强度。',
    en: 'From a position, randomly simulate to terminal with a fixed seed and tally outcomes to estimate strength.',
  },
  description: {
    zh: '纯蒙特卡洛模拟（Pure Rollout）是 MCTS 的模拟阶段，也可独立用于局面评估：从给定局面出发，双方都按（均匀或启发式）随机策略走到底，记录胜/负/平；重复 N 次，用胜率作为该局面的估值。它不建搜索树，因此极轻量。关键是用可复现的随机源（LCG + seed）保证确定性测试。本实现用 Nim 游戏演示：轮流从一堆中随机取若干石子，取最后一颗者胜。必胜局面（Nim-和 ≠ 0）应得到高胜率。',
    en: "Pure Monte Carlo Rollout is MCTS's simulation phase, usable standalone to evaluate a position: from a given state both sides play (uniform or heuristic) random moves to terminal, recording win/loss/draw; repeat N times and use the win rate as the estimate. It builds no tree, so it is very lightweight. The key is a reproducible RNG (LCG + seed) for deterministic tests. This implementation demonstrates on Nim: players randomly take stones from a heap; taking the last stone wins. A winning position (Nim-sum ≠ 0) should yield a high win rate.",
  },
  tags: ['ai-search', 'monte-carlo', 'stochastic', 'simulation'],
  complexity: { time: 'O(N × 平均 rollout 长度)', space: 'O(局面)' },
  references: [
    {
      label: 'Monte Carlo method — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Monte_Carlo_method',
    },
  ],
};
