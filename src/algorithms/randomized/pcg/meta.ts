// PCG (Permuted Congruential Generator) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pcg',
  categoryId: 'randomized',
  title: { zh: 'PCG 随机数生成器', en: 'Permuted Congruential Generator (PCG)' },
  summary: {
    zh: 'LCG 状态 + 位置换输出：用极少状态达到优质统计性，速度快。',
    en: 'An LCG state with a permutation output: excellent statistics from minimal state, very fast.',
  },
  description: {
    zh: "Permuted Congruential Generator（O'Neill 2014）用一个线性同余发生器（LCG）作为状态推进，再用一个非线性的「位置换」函数把状态映射为输出。LCG 部分：state = state * mult + inc (mod 2^64)。置换部分（PCG-XSH-RR 32 位）：xorshift（state ^= state >> shift），再旋转（rotate right）一定位数后取高 32 位。关键洞察是 LCG 的「高位」质量好，但低位差；置换把好的位散布到全字，从而获得优良的统计分布与长周期，且只用 128 位状态（远小于 MT19937 的 2.5KB）。本实现为 PCG32（64 位状态、32 位输出）。",
    en: "The Permuted Congruential Generator (O'Neill 2014) uses a linear congruential generator (LCG) for state advance and a non-linear bitwise permutation for output. LCG part: state = state * mult + inc (mod 2^64). Permutation part (PCG-XSH-RR 32-bit): xorshift (state ^= state >> shift) then rotate-right by a few bits and take the high 32 bits. The key insight is that an LCG's high bits are statistically good but its low bits are poor; the permutation diffuses the good bits across the whole word, yielding excellent statistics and a long period while using only 128 bits of state (far less than MT19937's 2.5KB). This implements PCG32 (64-bit state, 32-bit output).",
  },
  tags: ['randomized', 'prng', 'number-theory'],
  complexity: { time: 'O(1) per draw', space: 'O(1)' },
};
