// KISS 生成器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-kiss',
  categoryId: 'randomized',
  title: { zh: 'KISS 随机数生成器', en: 'KISS RNG' },
  summary: {
    zh: 'Keep It Simple Stupid：组合 LCG + XORSHIFT + MWC，统计优良。',
    en: 'Keep It Simple Stupid: combines LCG + XORSHIFT + MWC; passes strong statistical tests.',
  },
  description: {
    zh: 'KISS (Marsaglia) 组合三种简单生成器：一个线性同余、一个 xorshift、一个乘借位（带进位），输出异或/相加。任何单一组件的弱点被其他掩盖，通过 BigCrush。',
    en: "KISS (Marsaglia) combines three simple generators: a linear congruential, an xorshift, and a multiply-with-carry; their outputs are xored/added. Each component's weaknesses are masked by the others; passes BigCrush.",
  },
  tags: ['randomized', 'prng', 'kiss', 'combined'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
