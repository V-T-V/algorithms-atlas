// Huffman + 算术混合 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-huffman-arithmetic',
  categoryId: 'compression',
  title: { zh: 'Huffman 与算术混合', en: 'Huffman-Arithmetic Hybrid' },
  summary: {
    zh: '高频符号用 Huffman，低频/残余用算术编码，兼顾速度与压缩率。',
    en: 'High-frequency symbols use Huffman; low-frequency residue uses arithmetic coding, balancing speed and ratio.',
  },
  description: {
    zh: '混合编码策略：\n\n- 按频率排序，前 K 个高频符号用 Huffman 码本编码（解码快）。\n- 其余符号（罕见）用整数算术编码兜底。\n- 标志位区分两种编码路径。\n- 在保持接近 Huffman 解码速度的同时，提升整体压缩率。',
    en: 'A hybrid strategy:\n\n- Sort by frequency; the top-K frequent symbols are Huffman-coded (fast decode).\n- The remaining rare symbols fall back to integer arithmetic coding.\n- A flag bit distinguishes the two paths.\n- Approaches Huffman decode speed while improving overall ratio.',
  },
  tags: ['compression', 'entropy', 'hybrid'],
  complexity: { time: 'O(n + U log U)', space: 'O(U)' },
};
