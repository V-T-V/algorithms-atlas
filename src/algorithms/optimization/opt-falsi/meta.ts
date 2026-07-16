// 试位法（Regula Falsi）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-falsi',
  categoryId: 'optimization',
  title: { zh: '试位法', en: 'Regula Falsi' },
  summary: {
    zh: '用割线与 x 轴交点替代中点，保留符号约束的二分。',
    en: 'Use the secant-x-intercept instead of midpoint while keeping sign constraints.',
  },
  description: {
    zh: '试位法：c=(a·f(b)-b·f(a))/(f(b)-f(a))，根据 f(c) 符号替换 a 或 b。比二分快且保收敛。',
    en: 'Regula falsi: c=(a·f(b)-b·f(a))/(f(b)-f(a)); replace a or b by sign. Faster than bisection, stays convergent.',
  },
  tags: ['optimization', 'root-finding'],
  complexity: { time: 'O(log(1/ε))', space: 'O(1)' },
};
