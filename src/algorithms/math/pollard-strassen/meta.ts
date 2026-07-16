// Pollard-Strassen 因数分解 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pollard-strassen',
  categoryId: 'math',
  title: { zh: 'Pollard-Strassen 因数分解', en: 'Pollard-Strassen Factorization' },
  summary: {
    zh: '用乘积取模定位小因子，O(n^1/4) 求合数的一个非平凡因子。',
    en: 'Locate a small factor via product mod reduction in O(n^1/4).',
  },
  description: {
    zh: 'Pollard-Strassen 算法用块乘积取模快速找到 n 的一个非平凡因子。把候选区间 [2, ⌈√n⌉] 切成长度约 n^1/4 的块，每块内用阶乘式乘积 ∏(a+i) mod n 再 gcd(n, prod) 判定是否含因子；命中后在该块内二分定位。最坏 O(n^1/4) 比朴素 O(√n) 试除更快。适合大数的因子存在性检测。BigInt 实现。',
    en: 'Pollard-Strassen uses block-product reduction mod n to quickly find a non-trivial factor. Slice the candidate range [2, ⌈√n⌉] into blocks of length ~n^1/4; within each block compute ∏(a+i) mod n and gcd(n, prod) to test for a factor; on a hit, bisect to locate it. Worst case O(n^1/4), faster than trial division O(√n). Suited to detecting factor existence in large numbers. BigInt implementation.',
  },
  tags: ['math', 'number-theory', 'factorization', 'pollard'],
  complexity: { time: 'O(n^1/4)', space: 'O(n^1/4)' },
};
