import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-comb-3',
  categoryId: 'math',
  title: { zh: '组合数（预处理阶乘 + 模逆元）', en: 'Combinations (Factorial + Mod Inv)' },
  summary: {
    zh: '预处理 n! 与 (n!)⁻¹ mod p，O(1) 回答 C(n,k)。',
    en: 'Precompute factorials and inverse factorials; answer C(n,k) mod p in O(1).',
  },
  description: {
    zh: '在模素数 p 下：fact[i]=i!，invFact[i]=(i!)^(p-2)。C(n,k)=fact[n]·invFact[k]·invFact[n-k] mod p。',
    en: 'Under prime p: fact[i]=i!, invFact via Fermat. C(n,k)=fact[n]·invFact[k]·invFact[n-k] mod p.',
  },
  tags: ['math', 'combinatorics', 'modular'],
  complexity: { time: 'O(N) 预处理, O(1) 查询', space: 'O(N)' },
};
