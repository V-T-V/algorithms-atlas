import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-lucas-3',
  categoryId: 'math',
  title: { zh: 'Lucas 定理', en: 'Lucas Theorem' },
  summary: {
    zh: '小素数 p 下 O(log_p n) 计算 C(n,k) mod p。',
    en: 'Compute C(n,k) mod a small prime p in O(log_p n).',
  },
  description: {
    zh: 'Lucas 定理：C(n,k) ≡ Π C(n_i, k_i) mod p，其中 n_i, k_i 是 n, k 的 p 进制各位。递归 C(n,k)=C(n%p,k%p)·C(n/p,k/p)。',
    en: 'Lucas: C(n,k) ≡ product of C(n_i,k_i) over base-p digits. Recursive: C(n%p,k%p)·C(n/p,k/p).',
  },
  tags: ['math', 'lucas', 'modular'],
  complexity: { time: 'O(log_p n)', space: 'O(1)' },
};
