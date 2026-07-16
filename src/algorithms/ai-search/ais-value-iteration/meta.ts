// 价值迭代 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-value-iteration',
  categoryId: 'ai-search',
  title: { zh: '价值迭代 (Value Iteration)', en: 'Value Iteration' },
  summary: {
    zh: '在已知 MDP 上反复对贝尔曼最优方程做同步更新，直接逼近最优状态价值。',
    en: 'Repeatedly apply synchronous Bellman-optimality backups on a known MDP to converge directly to the optimal state value.',
  },
  description: {
    zh: '价值迭代：V_{k+1}(s) = max_a Σ_{s′} P(s′|s,a)·[r + γ·V_k(s′)]。停止时 V=V*，对应贪心策略即为最优。单次扫描复杂度 O(|S|²·|A|)。',
    en: 'Value iteration: V_{k+1}(s) = max_a Σ_{s′} P(s′|s,a)·[r + γ·V_k(s′)]. At convergence V=V* and the greedy policy is optimal. Per-sweep cost O(|S|²·|A|).',
  },
  tags: ['ai-search', 'reinforcement-learning', 'mdp', 'dynamic-programming', 'bellman'],
  complexity: { time: 'O(|S|²·|A|·k)', space: 'O(|S|)' },
};
