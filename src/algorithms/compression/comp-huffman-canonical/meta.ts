// 规范 Huffman · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-huffman-canonical',
  categoryId: 'compression',
  title: { zh: '规范 Huffman', en: 'Canonical Huffman' },
  summary: {
    zh: '只编码码长，再按规范规则重建码字，简化传输与解码。',
    en: 'Encode only code lengths, then rebuild codewords by canonical rules, simplifying transport and decoding.',
  },
  description: {
    zh: '规范 Huffman（Deflate/JPEG 使用）：\n\n- 第一步：用标准 Huffman 算法确定每个符号的码长。\n- 第二步：丢弃码字本身，只保留码长序列。\n- 第三步：按下述规范规则重建码字——相同码长的码字按符号序递增，码长增加时左移补 1。\n\n解码端只需码长即可完整恢复码本。',
    en: 'Canonical Huffman (used in Deflate/JPEG):\n\n- Step 1: determine each symbol code length via standard Huffman.\n- Step 2: discard actual codewords, keep only the length sequence.\n- Step 3: rebuild codewords canonically — same-length codes increment by symbol order; when length grows, left-shift and add 1.\n\nDecoders reconstruct the codebook from lengths alone.',
  },
  tags: ['compression', 'entropy', 'huffman'],
  complexity: { time: 'O(n + U log U)', space: 'O(U)' },
};
