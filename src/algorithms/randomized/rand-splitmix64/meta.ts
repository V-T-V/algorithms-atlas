// splitmix64 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-splitmix64',
  categoryId: 'randomized',
  title: { zh: 'splitmix64', en: 'splitmix64 RNG' },
  summary: { zh: 'splitmix64 伪随机数生成器。', en: 'splitmix64 pseudorandom generator.' },
  description: {
    zh: '常作种子扩展器；基于 γ=2^64/φ。',
    en: 'Often used as a seed splitter; based on γ=2^64/φ.',
  },
  tags: ['randomized', 'rng'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
