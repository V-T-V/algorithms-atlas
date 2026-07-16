// xorshift32 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-xorshift32',
  categoryId: 'randomized',
  title: { zh: 'xorshift32', en: 'xorshift32 RNG' },
  summary: { zh: 'xorshift32 伪随机数生成器。', en: 'xorshift32 pseudorandom generator.' },
  description: { zh: '三步异或移位，状态 32 位。', en: 'Three xor-shift steps; 32-bit state.' },
  tags: ['randomized', 'rng', 'xorshift'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
