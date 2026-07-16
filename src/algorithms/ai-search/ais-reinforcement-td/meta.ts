// 强化学习 TD(0) 策略评估 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-reinforcement-td',
  categoryId: 'ai-search',
  title: { zh: 'TD(0) 策略评估', en: 'TD(0) Policy Evaluation' },
  summary: {
    zh: '用时序差分 TD(0) 在马尔可夫奖励过程中估计给定时不变策略的状态价值。',
    en: 'Estimate state values of a fixed policy in a Markov Reward Process using temporal-difference TD(0) updates.',
  },
  description: {
    zh: 'TD(0) 单步自举更新：V(s) ← V(s) + α·[r + γ·V(s′) − V(s)]。无需环境模型，仅需采样转移 (s,r,s′)。本实现对有限 MRP 给定策略下批量回合采样并更新价值，直到收敛。',
    en: 'TD(0) one-step bootstrapping: V(s) ← V(s) + α·[r + γ·V(s′) − V(s)]. No model needed, only sampled transitions (s,r,s′). This implementation runs batched episode sampling under a fixed policy and updates values until convergence.',
  },
  tags: [
    'ai-search',
    'reinforcement-learning',
    'temporal-difference',
    'model-free',
    'policy-evaluation',
  ],
  complexity: { time: 'O(|S|·E·L)', space: 'O(|S|)' },
};
