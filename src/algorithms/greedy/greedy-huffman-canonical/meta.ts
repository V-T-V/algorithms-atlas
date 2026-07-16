// 规范哈夫曼编码（Canonical Huffman Codes）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-huffman-canonical',
  categoryId: 'greedy',
  title: { zh: '规范哈夫曼编码', en: 'Canonical Huffman Codes' },
  summary: {
    zh: '由码长生成规范编码，码表紧凑，解码高效。',
    en: 'Generate canonical codes from code lengths; compact tables, fast decoding.',
  },
  description: {
    zh: '规范哈夫曼：先求各符号码长，再按 (码长, 符号序) 分配连续整数编码。码表只需存码长，省空间。',
    en: 'Canonical Huffman: get symbol code lengths, then assign consecutive integer codes by (length, symbol). Tables store only lengths.',
  },
  tags: ['greedy', 'huffman', 'compression'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
