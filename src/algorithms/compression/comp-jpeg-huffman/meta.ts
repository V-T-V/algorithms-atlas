// JPEG Huffman 表 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-jpeg-huffman',
  categoryId: 'compression',
  title: { zh: 'JPEG Huffman 表', en: 'JPEG Huffman Table' },
  summary: {
    zh: 'JPEG 用 DHT 段存放 Huffman 表：BITS(各码长符号数) + HUFFVAL(符号列表)。',
    en: 'JPEG stores Huffman tables in the DHT segment: BITS (count per code length) plus HUFFVAL (symbol list).',
  },
  description: {
    zh: 'JPEG 中的 Huffman 编码（DHT 段）：\n\n- BITS[1..16]：码长为 i 的符号个数。\n- HUFFVAL：按码长、符号序排列的符号值列表。\n- 由 BITS 生成规范码本：相同码长按序递增，跨码长左移。\n- 对直流/交流系数分别编码（本实现演示通用 DHT 解码）。',
    en: 'JPEG Huffman coding (DHT segment):\n\n- BITS[1..16]: number of symbols with code length i.\n- HUFFVAL: symbols ordered by code length then symbol value.\n- BITS generates a canonical codebook: same-length codes increment; across lengths, left-shift.\n- DC and AC coefficients use separate tables (this demo shows generic DHT decoding).',
  },
  tags: ['compression', 'entropy', 'huffman', 'jpeg'],
  complexity: { time: 'O(16 + U)', space: 'O(U)' },
};
