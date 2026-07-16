// 表格 Q-Learning（Tabular Q-Learning）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-q-learning-table',
  categoryId: 'ai-search',
  title: { zh: '表格 Q-Learning', en: 'Tabular Q-Learning' },
  summary: { zh: '无模型 RL，用 Q 表离线更新。', en: 'Model-free RL updating Q-table off-policy.' },
  description: {
    zh: '表格 Q-Learning(Watkins)在离散状态/动作上维护 Q 表，用贝尔曼最优更新 Q(s,a)←Q+α[r+γmaxQ-Q]，ε-贪心探索。',
    en: 'Tabular Q-learning maintains a Q-table over discrete states/actions, updating via the Bellman optimality target with ε-greedy exploration.',
  },
  tags: ['ai-search', 'q-learning', 'reinforcement', 'tabular'],
  complexity: { time: 'O(episodes * steps)', space: 'O(|S|*|A|)' },
};
