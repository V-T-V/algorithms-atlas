// Brotli (简化) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-brotli-simple',
  categoryId: 'compression',
  title: { zh: 'Brotli 简化', en: 'Brotli (Simplified)' },
  summary: {
    zh: 'Brotli 用静态预设字典 + LZ77；本实现演示字典匹配加速。',
    en: 'Brotli uses a static preset dictionary plus LZ77; this demo shows dictionary-assisted matching.',
  },
  description: {
    zh: 'Brotli 是 Google 的现代压缩格式，专为 Web 优化：\n\n- 内置一张静态字典（常见 HTTP/Web 词汇），匹配起点前移。\n- LZ77 前缀匹配 + 二次 Huffman/Context 熵编码。\n- 本实现演示「静态字典」对短输入的增益。',
    en: 'Brotli is a modern format by Google optimized for the Web:\n\n- Ships a static dictionary of common HTTP/Web tokens, extending match reach.\n- LZ77 prefix matching plus Huffman/context entropy coding.\n- This demo shows the static-dictionary gain on short inputs.',
  },
  tags: ['compression', 'dictionary', 'lossless', 'web'],
  complexity: { time: 'O(n·(W+D))', space: 'O(n)' },
};
