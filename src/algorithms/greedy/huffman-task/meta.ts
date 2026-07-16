// Huffman Task · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'huffman-task',
  categoryId: 'greedy',
  title: { zh: '合并果子', en: 'Huffman Task' },
  summary: {
    zh: '合并果子属于greedy类别。',
    en: 'Huffman Task is a greedy algorithm.',
  },
  description: {
    zh: '合并果子（Huffman Task）属于greedy类别的算法。',
    en: 'Huffman Task is an algorithm in the greedy category.',
  },
  tags: ["greedy","compression"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
