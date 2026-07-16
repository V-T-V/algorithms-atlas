// 随机 2 的幂选择 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-power-of-two',
  categoryId: 'randomized',
  title: { zh: '随机 2 的幂选择', en: 'Random Power-of-Two Choice' },
  summary: { zh: '从 2 的幂集合中均匀采样。', en: 'Uniform sample from powers of two.' },
  description: {
    zh: '返回 2^k，k 在 [0,max] 内均匀。',
    en: 'Returns 2^k with k uniform in [0,max].',
  },
  tags: ['randomized', 'sampling'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
