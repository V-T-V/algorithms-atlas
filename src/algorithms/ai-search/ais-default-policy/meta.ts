// 默认策略 (Default Policy / Rollout) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-default-policy',
  categoryId: 'ai-search',
  title: { zh: 'MCTS 默认策略 (Rollout)', en: 'MCTS Default Policy (Rollout)' },
  summary: {
    zh: 'MCTS 模拟阶段：从节点出发随机走子到终局，返回奖励值。',
    en: 'MCTS simulation phase: random walk from a node to a terminal state, returning a reward.',
  },
  description: {
    zh: '默认策略（Default Policy，又称 Rollout / Simulation）是 MCTS 的第三阶段。从树策略到达的节点出发，用快速（通常随机或轻量启发式）的策略不断走子，直到终局，返回奖励值。rollout 的质量与速度权衡是 MCTS 效果关键：纯随机快但弱，启发式强但慢。本实现提供纯随机 rollout 与基于权重的 rollout 两种，使用注入的 RNG 保证可复现。',
    en: 'The Default Policy (also Rollout / Simulation) is the third MCTS phase. From the node reached by the tree policy, it plays out moves using a fast (usually random or lightweight-heuristic) policy until a terminal state, returning a reward. The quality-speed trade-off of rollouts is key to MCTS: pure random is fast but weak, heuristic is strong but slow. This implementation provides both pure-random and weight-based rollouts, using an injected RNG for reproducibility.',
  },
  tags: ['ai-search', 'mcts', 'rollout', 'simulation', 'random'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
