// 扩展欧几里得完整版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'exgcd-extended',
  categoryId: 'math',
  title: { zh: '扩展欧几里得完整版', en: 'Extended Euclidean (Complete)' },
  summary: {
    zh: '求 gcd 与 Bézout 系数，并附带模逆元、线性 Diophantine 通解。',
    en: 'Compute gcd with Bézout coefficients, plus modular inverse and linear Diophantine general solution.',
  },
  description: {
    zh: '扩展欧几里得算法在辗转相除的同时滚动三组变量 (r, s, t)，终止时 old_r = gcd(a,b) 且 a·oldS + b·oldT = gcd。本完整版额外提供：(1) 模逆元 inv(a) mod m（要求 gcd(a,m)=1）；(2) 线性 Diophantine 方程 a·x + b·y = c 的通解（c 必须被 gcd 整除，否则无解；通解为 x = x0 + k·(b/g)，y = y0 − k·(a/g)）。全程 BigInt 保证精确。',
    en: 'The extended Euclidean algorithm rolls three variable groups (r, s, t) alongside the division steps; at termination old_r = gcd(a,b) and a·oldS + b·oldT = gcd. This complete version also provides: (1) modular inverse inv(a) mod m (requires gcd(a,m)=1); (2) general solution to the linear Diophantine equation a·x + b·y = c (c must be divisible by gcd; general solution x = x0 + k·(b/g), y = y0 − k·(a/g)). Uses BigInt for exactness.',
  },
  tags: ['math', 'number-theory', 'gcd', 'modular-inverse', 'diophantine'],
  complexity: { time: 'O(log min(|a|,|b|))', space: 'O(1)' },
};
