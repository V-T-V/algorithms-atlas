// String Compression · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-compression',
  categoryId: 'string',
  title: { zh: '字符串压缩', en: 'String Compression' },
  summary: {
    zh: '字符串压缩属于string类别。',
    en: 'String Compression is a string algorithm.',
  },
  description: {
    zh: '字符串压缩（String Compression）属于string类别的算法。',
    en: 'String Compression is an algorithm in the string category.',
  },
  tags: ["string","compression"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
