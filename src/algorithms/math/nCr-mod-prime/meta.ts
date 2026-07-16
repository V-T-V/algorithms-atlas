// 组合数模素数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'nCr-mod-prime',
  categoryId: 'math',
  title: { zh: '组合数模素数', en: 'Combination mod Prime' },
  summary: {
    zh: '预处理阶乘与逆元，O(1) 查询 C(n,r) mod p（p 为素数）。',
    en: 'Precompute factorials and inverses to answer C(n,r) mod p in O(1) for prime p.',
  },
  description: {
    zh: '对素数模 p，预处理 fact[i]=i! mod p 与 invfact[i]=(i!)^-1 mod p（用费马小定理与线性求逆）。则 C(n,r) mod p = fact[n]·invfact[r]·invfact[n-r] mod p。预处理 O(N)，每次查询 O(1)。当 n ≥ p 时需用 Lucas 定理处理进位，本实现支持 Lucas 包装。',
    en: 'For a prime modulus p, precompute fact[i]=i! mod p and invfact[i]=(i!)^-1 mod p (via Fermat little theorem and linear inversion). Then C(n,r) mod p = fact[n]·invfact[r]·invfact[n-r] mod p. Preprocessing is O(N), each query O(1). When n ≥ p, Lucas theorem handles digit-carry in base p; this implementation provides a Lucas wrapper.',
  },
  tags: ['math', 'combinatorics', 'modular', 'binomial-coefficient'],
  complexity: { time: 'O(N) 预处理 / O(1) 或 O(log_p n) 查询', space: 'O(N)' },
};
