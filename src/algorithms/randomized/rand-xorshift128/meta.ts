// xorshift128 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-xorshift128',
  categoryId: 'randomized',
  title: { zh: 'xorshift128', en: 'xorshift128 RNG' },
  summary: { zh: '128 位状态 xorshift 生成器。', en: '128-bit state xorshift generator.' },
  description: { zh: '四个 32 位字状态，周期 2^128-1。', en: 'Four 32-bit words; period 2^128-1.' },
  tags: ['randomized', 'rng', 'xorshift'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
