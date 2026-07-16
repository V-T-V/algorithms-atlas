// LZ5（LZ5）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lz5',
  categoryId: 'compression',
  title: { zh: 'LZ5', en: 'LZ5' },
  summary: {
    zh: 'LZ5：LZ4 的更大窗口/字典变体，更高压缩比。',
    en: 'LZ5: larger-window LZ4 variant with better ratio.',
  },
  description: {
    zh: 'LZ5 在 LZ4 基础上增大窗口与哈希表，并优化长距离匹配，换取更高压缩比（仍保持较快解压）。',
    en: 'LZ5 enlarges the window and hash tables over LZ4 and optimizes long-distance matches for better ratio (still fast decode).',
  },
  tags: ['compression', 'lz5', 'dictionary', 'variant'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
