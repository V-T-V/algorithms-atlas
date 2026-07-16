// Huffman 规范编码 v4（Canonical Huffman v4）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-huffman-4',
  categoryId: 'compression',
  title: { zh: 'Huffman 规范编码 v4', en: 'Canonical Huffman v4' },
  summary: {
    zh: '规范 Huffman：按码长+符号序生成码字，省去树结构。',
    en: 'Canonical Huffman: codes from lengths + symbol order, no tree needed.',
  },
  description: {
    zh: '规范 Huffman（Deutsch）只编码每个符号的码长，解码端按码长升序+符号序重建码字。是 DEFLATE、JPEG 等的标准做法。',
    en: 'Canonical Huffman (Deutsch) encodes only each symbol code length; the decoder rebuilds codes by length-ascending + symbol order. Standard in DEFLATE, JPEG.',
  },
  tags: ['compression', 'huffman', 'canonical', 'entropy'],
  complexity: { time: 'O(n log n)', space: 'O(σ)' },
};
