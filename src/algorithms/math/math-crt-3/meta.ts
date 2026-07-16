import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-crt-3',
  categoryId: 'math',
  title: { zh: '中国剩余定理（非互素扩展）', en: 'CRT (Non-Coprime Extension)' },
  summary: {
    zh: '合并同余方程 x≡a (mod m)，即使模数两两不互素也能求解。',
    en: 'Merge congruences x≡a (mod m) even when moduli are not pairwise coprime.',
  },
  description: {
    zh: '用扩展欧几里得合并两个同余：x≡a1 mod m1 与 x≡a2 mod m2。若 gcd(m1,m2) 不整除 (a2-a1) 则无解；否则得新同余式。',
    en: 'Merge two congruences via extended Euclidean; if gcd(m1,m2) does not divide (a2-a1), no solution; otherwise produces a combined congruence.',
  },
  tags: ['math', 'crt', 'number-theory'],
  complexity: { time: 'O(n log m)', space: 'O(1)' },
};
