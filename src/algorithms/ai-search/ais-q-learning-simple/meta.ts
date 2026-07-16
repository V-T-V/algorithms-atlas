// Q-Learning · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-q-learning-simple',
  categoryId: 'ai-search',
  title: { zh: 'Q-Learning (离策略)', en: 'Q-Learning (off-policy)' },
  summary: {
    zh: '无模型离策略 TD 控制：用 ε-贪心采样学习最优动作价值 Q*。',
    en: 'Model-free off-policy TD control: learn optimal action values Q* using ε-greedy sampling.',
  },
  description: {
    zh: 'Q-Learning 更新：Q(s,a) ← Q(s,a) + α·[r + γ·max_{a′} Q(s′,a′) − Q(s,a)]。行为策略为 ε-贪心以保证探索，目标策略为纯贪心，因此是离策略算法。对有限 MDP 在充分探索与衰减步长下收敛到 Q*。',
    en: 'Q-Learning update: Q(s,a) ← Q(s,a) + α·[r + γ·max_{a′} Q(s′,a′) − Q(s,a)]. Behaviour policy is ε-greedy for exploration; the target is purely greedy, making it off-policy. Converges to Q* on finite MDPs under sufficient exploration and diminishing step size.',
  },
  tags: [
    'ai-search',
    'reinforcement-learning',
    'q-learning',
    'off-policy',
    'model-free',
    'td-control',
  ],
  complexity: { time: 'O(|S|·|A|·E·L)', space: 'O(|S|·|A|)' },
};
