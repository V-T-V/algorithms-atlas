import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-euler-3',
  categoryId: 'math',
  title: { zh: '欧拉函数（线性筛）', en: 'Euler Totient (Linear Sieve)' },
  summary: {
    zh: '用线性筛一次性求出 1..n 所有数的欧拉函数。',
    en: 'Linear sieve to compute Euler totient for every integer 1..n in one pass.',
  },
  description: {
    zh: '线性筛维护最小质因子。当 i 为素数时 phi[i]=i-1；i%prime==0 时 phi[i*p]=phi[i]*p，否则 phi[i*p]=phi[i]*(p-1)。',
    en: 'Linear sieve; phi[i]=i-1 when prime; phi[i*p]=phi[i]*p if p divides i else phi[i]*(p-1).',
  },
  tags: ['math', 'totient', 'sieve'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
