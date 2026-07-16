// 乘借位生成器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-mwc',
  categoryId: 'randomized',
  title: { zh: '乘借位生成器 (MWC)', en: 'Multiply-With-Carry (MWC)' },
  summary: {
    zh: 'x_n = a*x_{n-1} + carry；高位为新 carry，低位为输出。',
    en: 'x_n = a*x_{n-1} + carry; high part is the new carry, low part is the output.',
  },
  description: {
    zh: 'Marsaglia 的乘借位（MWC）：t = a*x + carry; x = t mod b; carry = floor(t/b)。周期接近 b*2^31。结构简单、速度快、统计优良。',
    en: "Marsaglia's Multiply-With-Carry: t = a*x + carry; x = t mod b; carry = floor(t/b). Period near b*2^31. Simple, fast, statistically strong.",
  },
  tags: ['randomized', 'prng', 'mwc', 'multiply-with-carry'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
