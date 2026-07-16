// Adler-32 校验 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-adler32',
  categoryId: 'bitwise',
  title: { zh: 'Adler-32 校验', en: 'Adler-32 Checksum' },
  summary: {
    zh: 'zlib 使用的轻量校验：两个对 65521 取模的累加和 s1、s2。',
    en: 'Lightweight zlib checksum: two running sums s1, s2 modulo 65521.',
  },
  description: {
    zh: 'Adler-32 校验：维护两个累加和 s1、s2（均模 65521，65521 是小于 65536 的最大素数）。\n\n初始 s1 = 1，s2 = 0。对每个字节 b：\n```\ns1 = (s1 + b) mod 65521\ns2 = (s2 + s1) mod 65521\n```\n结果 = (s2 << 16) | s1。\n\nAdler-32 比 CRC32 快得多，但错误检测能力弱于 CRC32，是 zlib 的默认校验。复杂度 O(n)。',
    en: 'Adler-32 maintains two sums s1, s2 modulo 65521 (largest prime < 65536): init s1=1, s2=0; per byte b: s1=(s1+b)%65521, s2=(s2+s1)%65521; result=(s2<<16)|s1. Faster than CRC32 but weaker at error detection. O(n).',
  },
  tags: ['bitwise', 'adler', 'checksum', 'error-detection'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
