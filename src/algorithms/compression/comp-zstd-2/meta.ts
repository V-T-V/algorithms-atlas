// Zstandard v2（Zstandard v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-zstd-2',
  categoryId: 'compression',
  title: { zh: 'Zstandard v2', en: 'Zstandard v2' },
  summary: {
    zh: 'Zstd：LZ + FSE 熵编码，平衡速度与压缩比。',
    en: 'Zstd: LZ + FSE entropy coding, balancing speed and ratio.',
  },
  description: {
    zh: 'Zstandard（Facebook）用 LZ77 系列 + 有限状态熵编码（FSE/tANS），可选块树结构（RLE/Repeat/Raw）。',
    en: 'Zstandard (Facebook) uses LZ77-family plus FSE/tANS entropy coding, with optional block-tree structures (RLE/Repeat/Raw).',
  },
  tags: ['compression', 'zstd', 'lz', 'fse', 'entropy'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
