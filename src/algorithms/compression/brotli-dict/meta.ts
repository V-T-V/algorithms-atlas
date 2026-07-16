// Brotli 风格字典压缩 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'brotli-dict',
  categoryId: 'compression',
  title: { zh: 'Brotli 风格字典压缩', en: 'Brotli-style Dictionary Compression' },
  summary: {
    zh: '借助静态字典把高频子串替换成引用。',
    en: 'Replaces frequent substrings with references to a static dictionary.',
  },
  description: {
    zh: 'Brotli 内置一张静态字典（针对 Web 文本优化），编码时把输入中匹配字典词的片段替换成 (字典索引, 长度) 引用，未匹配部分原样输出。本实现用一张小字典演示该思路。',
    en: 'Brotli ships a static dictionary tuned for Web text; encoding replaces input fragments that match dictionary words with (index, length) references and leaves unmatched bytes as literals. This implementation uses a small dictionary to illustrate the idea.',
  },
  tags: ['compression', 'dictionary', 'lossless'],
  complexity: { time: 'O(n·D·L)', space: 'O(D)' },
};
