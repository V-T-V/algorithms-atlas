// Range Coder · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'range-coder',
  categoryId: 'compression',
  title: { zh: '范围编码', en: 'Range Coder' },
  summary: {
    zh: '范围编码属于compression类别。',
    en: 'Range Coder is a compression algorithm.',
  },
  description: {
    zh: '范围编码（Range Coder）属于compression类别的算法。',
    en: 'Range Coder is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(N)', space: 'O(|Σ|)' },
};
