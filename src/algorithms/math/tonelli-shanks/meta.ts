// Tonelli-Shanks 模平方根 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tonelli-shanks',
  categoryId: 'math',
  title: { zh: 'Tonelli-Shanks 模平方根', en: 'Tonelli-Shanks Modular Square Root' },
  summary: {
    zh: '求奇素数 p 下 x² ≡ n (mod p) 的解，O(log²p)。',
    en: 'Solve x² ≡ n (mod p) for odd prime p in O(log²p).',
  },
  description: {
    zh: 'Tonelli-Shanks 算法求模奇素数 p 的平方根：(1) 把 p-1 写成 q·2^k；(2) 找一个二次非剩余 z，令 c = z^q；(3) 维护 r = n^((q+1)/2)、t = n^q、M = k；(4) 反复找最小 i 使 t^(2^i)=1，用 c^(2^(M-i-1)) 更新 r 与 t，直到 t=1。若 n 是非剩余（欧拉判别）则无解返回 null。BigInt 实现保证大数精确。p ≡ 3 mod 4 时可用更简单的 Cipolla 公式 r = n^((p+1)/4)。',
    en: 'The Tonelli-Shanks algorithm finds a modular square root modulo an odd prime p: (1) factor p-1 = q·2^k; (2) find a quadratic non-residue z, set c = z^q; (3) maintain r = n^((q+1)/2), t = n^q, M = k; (4) repeatedly find the smallest i with t^(2^i)=1, update r and t with c^(2^(M-i-1)) until t=1. If n is a non-residue (Euler criterion) there is no solution and null is returned. BigInt for exactness. When p ≡ 3 mod 4 the simpler Cipolla formula r = n^((p+1)/4) applies.',
  },
  tags: ['math', 'number-theory', 'modular-sqrt', 'quadratic-residue'],
  complexity: { time: 'O(log² p)', space: 'O(1)' },
};
