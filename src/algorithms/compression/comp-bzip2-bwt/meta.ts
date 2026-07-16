// BWT 后缀排序(教学)（BWT via Suffix Sort）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-bzip2-bwt',
  categoryId: 'compression',
  title: { zh: 'BWT 后缀排序(教学)', en: 'BWT via Suffix Sort' },
  summary: { zh: '用后缀数组求 BWT。', en: 'Computes BWT via suffix array.' },
  description: {
    zh: '用后缀数组法求 Burrows-Wheeler 变换：对带结束符的串排序所有循环移位，取最后一列，常配合 MTF+RLE+Huffman(bzip2)。',
    en: 'Computes the Burrows-Wheeler transform via suffix sorting the rotations of a terminated string (bzip2 pipeline).',
  },
  tags: ['compression', 'bwt', 'bzip2'],
  complexity: { time: 'O(n^2 log n)', space: 'O(n^2)' },
};
