// 割线法（Secant Method）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-secant',
  categoryId: 'optimization',
  title: { zh: '割线法', en: 'Secant Method' },
  summary: {
    zh: "用两点连线斜率代替导数，无需 f' 也能超线性收敛。",
    en: "Use the secant slope instead of the derivative; superlinear, no f' needed.",
  },
  description: {
    zh: '割线法：x_{n+1}=x_n - f(x_n)(x_n-x_{n-1})/(f(x_n)-f(x_{n-1}))。收敛阶 φ≈1.618。',
    en: 'Secant: x_{n+1}=x_n - f(x_n)(x_n-x_{n-1})/(f(x_n)-f(x_{n-1})). Order phi~1.618.',
  },
  tags: ['optimization', 'root-finding'],
  complexity: { time: 'O(log(1/ε))', space: 'O(1)' },
};
