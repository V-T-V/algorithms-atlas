// Adler-32（Adler-32）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-adler32',
  categoryId: 'hashing',
  title: { zh: 'Adler-32', en: 'Adler-32' },
  summary: {
    zh: 'Zlib 用的轻量校验和：两个模 65521 的累加和。',
    en: 'Lightweight zlib checksum: two running sums mod 65521.',
  },
  description: {
    zh: 'Adler-32：s1=(1+Σbytes) mod 65521，s2=Σ(每个位置的 s1) mod 65521，结果 (s2<<16)|s1。',
    en: 'Adler-32: s1=(1+Σbytes) mod 65521, s2=Σ(s1 at each step) mod 65521; result (s2<<16)|s1.',
  },
  tags: ['hashing', 'checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
