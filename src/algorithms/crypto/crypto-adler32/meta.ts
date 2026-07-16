// Adler-32 校验（Adler-32）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-adler32',
  categoryId: 'crypto',
  title: { zh: 'Adler-32 校验', en: 'Adler-32' },
  summary: { zh: 'zlib 用的快速校验和。', en: 'Fast checksum used by zlib.' },
  description: {
    zh: 'Adler-32 维护两个模 65521 的累加器 s1、s2，比 CRC32 快但弱，zlib 头部使用。',
    en: 'Adler-32 keeps two accumulators mod 65521 (s1, s2); faster but weaker than CRC32, used in zlib headers.',
  },
  tags: ['crypto', 'checksum', 'adler'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
