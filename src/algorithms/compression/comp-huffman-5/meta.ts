// Huffman 自适应 v5（Adaptive Huffman v5）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-huffman-5',
  categoryId: 'compression',
  title: { zh: 'Huffman 自适应 v5', en: 'Adaptive Huffman v5' },
  summary: {
    zh: '自适应 Huffman：单遍扫描，频率随编码更新。',
    en: 'Adaptive Huffman: single pass; frequencies update during encoding.',
  },
  description: {
    zh: '自适应 Huffman（Knuth 改进）一遍扫描即可编码，无需先统计频率；编码器与解码器同步维护同一棵动态树。',
    en: 'Adaptive Huffman (Knuth improvements) encodes in one pass without pre-counting frequencies; encoder and decoder maintain the same dynamic tree in lockstep.',
  },
  tags: ['compression', 'huffman', 'adaptive', 'online'],
  complexity: { time: 'O(n log σ)', space: 'O(σ)' },
};
