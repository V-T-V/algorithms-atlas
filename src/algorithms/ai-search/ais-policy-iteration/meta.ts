// 策略迭代 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-policy-iteration',
  categoryId: 'ai-search',
  title: { zh: '策略迭代 (Policy Iteration)', en: 'Policy Iteration' },
  summary: {
    zh: '在已知 MDP 上交替进行策略评估与策略改进直至策略稳定，求得最优策略。',
    en: 'Alternate policy evaluation and policy improvement on a known MDP until the policy stabilizes, yielding an optimal policy.',
  },
  description: {
    zh: '策略迭代 = (1) 策略评估：求解当前策略 π 的 V^π（解线性方程组 V = R^π + γ·P^π·V）；(2) 策略改进：贪心选 argmax_a Σ P(s′|s,a)·[r + γ·V(s′)]。重复直到策略不变。对有限 MDP 必在有限步内收敛到最优。',
    en: 'Policy iteration = (1) Policy evaluation: solve V^π for the current policy (linear system V = R^π + γ·P^π·V); (2) Policy improvement: greedily pick argmax_a Σ P(s′|s,a)·[r + γ·V(s′)]. Repeat until policy is unchanged. Converges finitely to the optimum on finite MDPs.',
  },
  tags: ['ai-search', 'reinforcement-learning', 'mdp', 'dynamic-programming', 'optimal-control'],
  complexity: { time: 'O(|S|³·k)', space: 'O(|S|²)' },
};
