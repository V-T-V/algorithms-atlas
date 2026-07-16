// 教与学优化（Teaching-Learning-Based Optimization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-teaching-learning',
  categoryId: 'ai-search',
  title: { zh: '教与学优化', en: 'Teaching-Learning-Based Optimization' },
  summary: {
    zh: '教师阶段向最优靠拢，学习阶段两两交互（Sphere 目标）。',
    en: 'Teacher phase moves toward best; learner phase pairs interact (Sphere target).',
  },
  description: {
    zh: 'TLBO（Rao 2011）：教师阶段 x_new = x + r·(teacher − TF·mean)；学习阶段两两比较，差者向好者学习。无算法参数，仅需种群与迭代数。',
    en: 'TLBO (Rao 2011): teacher phase x_new = x + r·(teacher − TF·mean); learner phase pairs interact, the worse improving toward the better. No algorithm parameters besides population and iterations.',
  },
  tags: ['ai-search', 'population', 'optimization', 'tlbo'],
  complexity: { time: 'O(iter × pop × d)', space: 'O(pop × d)' },
};
