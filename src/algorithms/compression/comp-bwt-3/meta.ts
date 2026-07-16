// BWT v3（Burrows-Wheeler Transform v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-bwt-3',
  categoryId: 'compression',
  title: { zh: 'BWT v3', en: 'Burrows-Wheeler Transform v3' },
  summary: {
    zh: 'BWT：对所有循环旋转排序，输出末列 + 原始行号。',
    en: 'BWT: sort all cyclic rotations, output last column + original row index.',
  },
  description: {
    zh: 'BWT（Burrows & Wheeler）对字符串的所有循环旋转排序，输出最后一列 L 和原始字符串所在行索引 primary。L 中相同字符聚集，便于后续 RLE/MTF。',
    en: 'BWT (Burrows & Wheeler) sorts all cyclic rotations and outputs the last column L plus the primary index of the original row. L clusters identical chars, suiting RLE/MTF.',
  },
  tags: ['compression', 'bwt', 'transform', 'reversible'],
  complexity: { time: 'O(n² log n) naive', space: 'O(n²)' },
};
