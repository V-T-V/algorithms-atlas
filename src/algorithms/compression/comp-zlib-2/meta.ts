// zlib v2（zlib v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-zlib-2',
  categoryId: 'compression',
  title: { zh: 'zlib v2', en: 'zlib v2' },
  summary: {
    zh: 'zlib：DEFLATE + Adler-32 校验 + 短头部。',
    en: 'zlib: DEFLATE + Adler-32 checksum + short header.',
  },
  description: {
    zh: 'zlib = 2 字节头部（CMF + FLG）+ DEFLATE 数据 + 4 字节 Adler-32 校验。比 gzip 头更短。',
    en: 'zlib = 2-byte header (CMF + FLG) + DEFLATE payload + 4-byte Adler-32 checksum; shorter header than gzip.',
  },
  tags: ['compression', 'zlib', 'deflate', 'adler32'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
