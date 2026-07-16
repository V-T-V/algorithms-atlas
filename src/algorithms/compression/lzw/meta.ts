// LZW Coding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lzw',
  categoryId: 'compression',
  title: { zh: 'LZW 编码', en: 'LZW Coding' },
  summary: {
    zh: 'LZW 编码属于compression类别。',
    en: 'LZW Coding is a compression algorithm.',
  },
  description: {
    zh: 'LZW 编码（LZW Coding）属于compression类别的算法。',
    en: 'LZW Coding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
