import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-gcd-3',
  categoryId: 'math',
  title: { zh: '二元 GCD（Stein 算法）', en: 'Binary GCD (Stein)' },
  summary: {
    zh: '只用位移、加减法求最大公约数，避免大整数除法。',
    en: 'Computes GCD using only shifts, addition, subtraction — no expensive division.',
  },
  description: {
    zh: 'Stein 算法：若 a,b 都偶 gcd=a/2,b/2 的 gcd ×2；只 a 偶 gcd=gcd(a/2,b)；都奇则 gcd=gcd(|a-b|/2, min(a,b))。',
    en: 'Stein: both even → factor 2; one even → halve it; both odd → reduce to half their difference.',
  },
  tags: ['math', 'gcd', 'stein'],
  complexity: { time: 'O(log² n)', space: 'O(1)' },
};
