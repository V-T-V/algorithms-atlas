// xoroshiro128+ · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-xoroshiro128',
  categoryId: 'randomized',
  title: { zh: 'xoroshiro128+', en: 'xoroshiro128+ RNG' },
  summary: { zh: 'xoroshiro128+ 伪随机数生成器。', en: 'xoroshiro128+ generator.' },
  description: {
    zh: ' scrambler-rotate-xor 高质量、快速。',
    en: 'Scramble-rotate-xor; high quality and fast.',
  },
  tags: ['randomized', 'rng'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
