// 黄金比斐波那契（Golden Ratio Fibonacci）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-fib-golden',
  categoryId: 'misc',
  title: { zh: '黄金比斐波那契', en: 'Golden Ratio Fibonacci' },
  summary: {
    zh: '用 Binet 公式 F_n=(φⁿ-ψⁿ)/√5 直接计算，但浮点精度有限。',
    en: 'Binet formula F_n=(phi^n-psi^n)/sqrt5 directly; limited by floating precision.',
  },
  description: {
    zh: 'Binet：F_n = (φⁿ - (1-φ)ⁿ)/√5，φ=(1+√5)/2。O(log n) 快速幂，但大 n 有精度损失。',
    en: 'Binet: F_n=(phi^n-(1-phi)^n)/sqrt5, phi=(1+sqrt5)/2. O(log n) via fast pow, precision loss for large n.',
  },
  tags: ['misc', 'sequence', 'number-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
