// SARSA · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-sarsa-simple',
  categoryId: 'ai-search',
  title: { zh: 'SARSA (在策略)', en: 'SARSA (on-policy)' },
  summary: {
    zh: '无模型在策略 TD 控制：用 ε-贪心下一动作直接自举，学习当前策略的动作价值。',
    en: 'Model-free on-policy TD control: bootstrap using the ε-greedy next action directly, learning the action value of the current policy.',
  },
  description: {
    zh: 'SARSA 更新：Q(s,a) ← Q(s,a) + α·[r + γ·Q(s′,a′) − Q(s,a)]，其中 a′ 由同一 ε-贪心策略采样得到。因为是“State-Action-Reward-State-Action”五元组而得名。在策略使其在含惩罚/危险动作的环境中学到更保守的策略。',
    en: 'SARSA update: Q(s,a) ← Q(s,a) + α·[r + γ·Q(s′,a′) − Q(s,a)], where a′ is sampled from the same ε-greedy policy. Named for the (S,A,R,S′,A′) quintuple. On-policy behaviour yields more conservative policies in environments with costly actions.',
  },
  tags: ['ai-search', 'reinforcement-learning', 'sarsa', 'on-policy', 'model-free', 'td-control'],
  complexity: { time: 'O(|S|·|A|·E·L)', space: 'O(|S|·|A|)' },
};
