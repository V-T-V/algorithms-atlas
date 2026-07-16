import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-modular-linear',
  categoryId: 'math',
  title: { zh: '线性同余方程', en: 'Linear Congruence Equation' },
  summary: {
    zh: '求解 ax ≡ b (mod m)，输出所有解 x mod m。',
    en: 'Solve ax ≡ b (mod m), return all solutions x mod m.',
  },
  description: {
    zh: '等价于 ax + my = b，用扩展欧几里得求 ax + my = g 的解；若 b 不能被 g 整除则无解。共 g 个模 m 的解。',
    en: 'Equivalent to ax + my = b; solve ax + my = gcd(a,m) by extended Euclid. No solution if g∤b. There are g solutions mod m.',
  },
  tags: ['math', 'modular', 'number-theory', 'gcd'],
  complexity: { time: 'O(log min(a,m))', space: 'O(log m)' },
};
