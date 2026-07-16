// 牛顿迭代（Newton-Raphson）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-newton-raphson',
  categoryId: 'optimization',
  title: { zh: '牛顿迭代', en: 'Newton-Raphson' },
  summary: {
    zh: "用切线逼近零点 x←x-f(x)/f'(x)，二阶收敛。",
    en: "Tangent-line iteration x<-x-f(x)/f'(x) with quadratic convergence.",
  },
  description: {
    zh: "牛顿法：x_{n+1}=x_n - f(x_n)/f'(x_n)。单根附近二阶收敛，但需好初值与可导。",
    en: "Newton: x_{n+1}=x_n - f(x_n)/f'(x_n). Quadratic near simple root, needs good start + derivative.",
  },
  tags: ['optimization', 'root-finding'],
  complexity: { time: 'O(log log(1/ε))', space: 'O(1)' },
};
