// 孔多塞悖论（Condorcet Paradox）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-voting-paradox',
  categoryId: 'game',
  title: { zh: '孔多塞悖论', en: 'Condorcet Paradox' },
  summary: {
    zh: '群体偏好可能循环：A>B、B>C、C>A，违反传递性。',
    en: 'Aggregate preferences can cycle: A>B, B>C, C>A, violating transitivity.',
  },
  description: {
    zh: '孔多塞悖论：两两多数表决可能产生循环偏好（非传递），即使个人偏好都传递。揭示聚合规则的内在矛盾。',
    en: 'Condorcet paradox: pairwise majority voting can yield cyclical (intransitive) social preference even when all individuals are transitive.',
  },
  tags: ['game', 'social-choice', 'voting'],
  complexity: { time: 'O(n·m²)', space: 'O(m²)' },
};
