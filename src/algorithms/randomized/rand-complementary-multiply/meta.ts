// 补乘生成器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-complementary-multiply',
  categoryId: 'randomized',
  title: { zh: '补乘同余生成器', en: 'Complementary Multiply-With-Carry (CMWC)' },
  summary: {
    zh: 'CMWC：x_n = M-1 - (a*x+c mod M)，长周期、统计优良。',
    en: 'CMWC: x_n = M-1 - (a*x+c mod M); long period, excellent statistics.',
  },
  description: {
    zh: '补乘带进位（CMWC，Marsaglia）是 MWC 的变体：用补数形式输出，周期可达 (2^r-1)*b^(r-1)。本实现用简化版 CMWC（单元素 + 进位）。',
    en: 'Complementary Multiply-With-Carry (Marsaglia) is a variant of MWC that outputs the complement, achieving period up to (2^r-1)*b^(r-1). This is a simplified single-lag CMWC.',
  },
  tags: ['randomized', 'prng', 'cmwc', 'multiply-with-carry'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
