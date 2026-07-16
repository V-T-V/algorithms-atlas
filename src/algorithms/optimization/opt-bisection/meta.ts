// 二分法求根（Bisection Root Finding）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-bisection',
  categoryId: 'optimization',
  title: { zh: '二分法求根', en: 'Bisection Root Finding' },
  summary: {
    zh: '在符号变化区间反复折半，线性收敛到连续函数零点。',
    en: 'Halve a sign-changing interval repeatedly; linear convergence to a root.',
  },
  description: {
    zh: '二分法：f 在 [a,b] 连续且异号，每步取中点 c，根据 f(c) 符号缩小区间。收敛率 1/2。',
    en: 'Bisection: f continuous sign-changing on [a,b]; take midpoint c, shrink by f(c) sign. Rate 1/2.',
  },
  tags: ['optimization', 'root-finding'],
  complexity: { time: 'O(log(1/ε))', space: 'O(1)' },
};
