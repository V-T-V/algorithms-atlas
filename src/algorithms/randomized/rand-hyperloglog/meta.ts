// HyperLogLog 简版 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-hyperloglog',
  categoryId: 'randomized',
  title: { zh: 'HyperLogLog 简版', en: 'HyperLogLog (Simple)' },
  summary: { zh: '基数估计的简化版本。', en: 'Simplified cardinality estimation.' },
  description: {
    zh: '统计哈希前导零的最大值，估计不同元素个数。',
    en: 'Track max leading-zeros of hashes to estimate distinct count.',
  },
  tags: ['randomized', 'data-structure', 'cardinality'],
  complexity: { time: 'O(1)', space: 'O(m)' },
};
