// Linear Congruential Generator · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'linear-congruential-generator',
  categoryId: 'randomized',
  title: { zh: '线性同余生成器', en: 'Linear Congruential Generator' },
  summary: {
    zh: '最经典的伪随机数生成器：Xₙ₊₁ = (a·Xₙ + c) mod m。',
    en: 'The classic PRNG recurrence: Xₙ₊₁ = (a·Xₙ + c) mod m.',
  },
  description: {
    zh: '线性同余生成器（LCG）由 Lehmer 于 1949 年提出，是历史上最广泛使用的伪随机数生成器之一。递推式 Xₙ₊₁ = (a·Xₙ + c) mod m 仅需一次乘法、一次加法、一次取模，速度极快。\n\n本实现默认采用 glibc 的参数：a=1103515245，c=12345，m=2³¹。周期与参数选取强相关——Hull-Dobell 定理给出达到满周期 m 的条件：(1) c 与 m 互素；(2) a−1 能被 m 的所有素因子整除；(3) 若 4|m，则 4|(a−1)。glibc 参数满足满周期。同一种子产生确定序列，便于复现。',
    en: 'The Linear Congruential Generator (LCG), proposed by Lehmer in 1949, is one of the most widely used PRNGs in history. The recurrence Xₙ₊₁ = (a·Xₙ + c) mod m needs just one multiply, one add, and one modulo, making it very fast.\n\nThis implementation defaults to glibc parameters: a=1103515245, c=12345, m=2³¹. The period depends heavily on the parameters—the Hull-Dobell theorem gives the conditions for a full period of m: (1) c and m are coprime; (2) a−1 is divisible by every prime factor of m; (3) if 4|m then 4|(a−1). The glibc parameters yield a full period. The same seed produces a deterministic sequence, aiding reproducibility.',
  },
  tags: ['randomized', 'prng', 'simulation', 'number-theory'],
  complexity: { time: 'O(1) per draw', space: 'O(1)' },
};
