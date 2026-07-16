import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-wavelet-tree-2',
  categoryId: 'ds',
  title: { zh: '小波树', en: 'Wavelet Tree' },
  summary: {
    zh: '支持区间第 k 小、排名、频率查询的静态结构。',
    en: 'Static structure supporting range k-th smallest, rank, frequency.',
  },
  description: {
    zh: '按值域中位数划分，每层记录位图与前后缀计数。空间 O(n log σ)，查询 O(log σ)。',
    en: 'Partition by median; bitvectors per level. Space O(n log σ), query O(log σ).',
  },
  tags: ['ds', 'wavelet', 'range-query'],
  complexity: { time: 'O(log σ)', space: 'O(n log σ)' },
};
