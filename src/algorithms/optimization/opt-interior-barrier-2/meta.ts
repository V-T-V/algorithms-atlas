// 内点障碍法（Interior Point Barrier Method）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-interior-barrier-2',
  categoryId: 'optimization',
  title: { zh: '内点障碍法', en: 'Interior Point Barrier Method' },
  summary: {
    zh: '用对数障碍把不等式约束并入目标，沿中心路径逼近最优。',
    en: 'Fold inequality constraints into the objective via a log barrier; track central path.',
  },
  description: {
    zh: '障碍法：min f(x)-μ·Σlog(b_i-a_i^T x)，μ→0。每步用牛顿法，得到中心路径。',
    en: 'Barrier method: min f(x)-μ·Σlog(b_i-a_i^T x), μ→0. Newton steps trace the central path.',
  },
  tags: ['optimization', 'constrained', 'interior-point'],
  complexity: { time: 'O(k·n³)', space: 'O(n²)' },
};
