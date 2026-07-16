// Huffman Coding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'huffman',
  categoryId: 'compression',
  title: { zh: '哈夫曼编码', en: 'Huffman Coding' },
  summary: {
    zh: '哈夫曼编码属于compression类别。',
    en: 'Huffman Coding is a compression algorithm.',
  },
  description: {
    zh: '哈夫曼编码（Huffman Coding）属于compression类别的算法。',
    en: 'Huffman Coding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
