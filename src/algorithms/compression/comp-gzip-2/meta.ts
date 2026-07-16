// gzip v2（gzip v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-gzip-2',
  categoryId: 'compression',
  title: { zh: 'gzip v2', en: 'gzip v2' },
  summary: {
    zh: 'gzip：DEFLATE + 头部 + CRC32 校验。',
    en: 'gzip: DEFLATE + header + CRC32 checksum.',
  },
  description: {
    zh: 'gzip = DEFLATE 数据 + 元信息头部（魔数、修改时间、标志）+ 尾部 CRC32 与原始大小。',
    en: 'gzip = DEFLATE payload + a metadata header (magic, mtime, flags) + a CRC32 and original-size trailer.',
  },
  tags: ['compression', 'gzip', 'deflate', 'crc32'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
