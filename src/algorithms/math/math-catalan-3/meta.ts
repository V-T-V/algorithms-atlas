import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-catalan-3',
  categoryId: 'math',
  title: { zh: 'Catalan 数（公式法）', en: 'Catalan Numbers (Closed Form)' },
  summary: {
    zh: '用 C(n)=C(2n,n)/(n+1) 计算 mod p 的第 n 个 Catalan 数。',
    en: 'Compute the n-th Catalan number mod p via C(n)=C(2n,n)/(n+1).',
  },
  description: {
    zh: '预处理阶乘与逆元后，Catalan(n) = C(2n,n) · (n+1)⁻¹ mod p。',
    en: 'With factorials/inverses precomputed, Catalan(n) = C(2n,n) · inverse(n+1) mod p.',
  },
  tags: ['math', 'catalan', 'combinatorics'],
  complexity: { time: 'O(N) 预处理', space: 'O(N)' },
};
