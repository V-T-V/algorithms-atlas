// 精确策略迭代（Exact Policy Iteration）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-policy-iteration-exact',
  categoryId: 'ai-search',
  title: { zh: '精确策略迭代', en: 'Exact Policy Iteration' },
  summary: { zh: '交替改进策略与策略评估。', en: 'Alternates policy evaluation and improvement.' },
  description: {
    zh: '策略迭代反复评估当前策略得到 V 值，再据此贪心改进策略，直到策略稳定，对有限 MDP 收敛到最优。',
    en: 'Policy iteration alternates evaluating the current policy to get V then improving it greedily until stable; converges for finite MDPs.',
  },
  tags: ['ai-search', 'mdp', 'policy-iteration', 'reinforcement'],
  complexity: { time: 'O(n^3)', space: 'O(n)' },
};
