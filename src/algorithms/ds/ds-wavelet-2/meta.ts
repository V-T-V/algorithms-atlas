import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-wavelet-2',
  categoryId: 'ds',
  title: { zh: '小波树（Wavelet Tree）', en: 'Wavelet Tree' },
  summary: {
    zh: '在 O(log σ) 内查询区间第 k 小、区间排名、区间频率。',
    en: 'Range k-th smallest, rank, frequency queries in O(log σ).',
  },
  description: {
    zh: '按二进制位递归分治，每层用 bitvector + 前缀和加速。',
    en: 'Recursive partitioning by binary digits; each level uses a bitvector + prefix sum.',
  },
  tags: ['ds', 'wavelet-tree', 'bitvector'],
  complexity: { time: 'O(log σ)', space: 'O(n log σ)' },
};
