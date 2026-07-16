// Brotli 熵编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-brotli-entropy',
  categoryId: 'compression',
  title: { zh: 'Brotli 熵编码', en: 'Brotli Entropy Coding' },
  summary: {
    zh: 'Brotli 第二阶段：按频率构建 Huffman 码本，对字面量做熵编码。',
    en: 'Brotli second stage: build a Huffman codebook by frequency and entropy-code literals.',
  },
  description: {
    zh: 'Brotli 的熵编码阶段使用多张 Huffman 表，按上下文切换。本实现简化为：按字符频率构建单张 Huffman 码本，对字面量序列编码并演示往返。',
    en: 'Brotli entropy stage uses multiple Huffman tables switched by context. This simplified version builds a single Huffman codebook by frequency and round-trips the literal stream.',
  },
  tags: ['compression', 'entropy', 'huffman', 'lossless'],
  complexity: { time: 'O(n + U log U)', space: 'O(U)' },
};
