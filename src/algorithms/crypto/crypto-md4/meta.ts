// MD4（MD4）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-md4',
  categoryId: 'crypto',
  title: { zh: 'MD4', en: 'MD4' },
  summary: {
    zh: 'MD4：Rivest 128 位哈希，3 轮 16 步。',
    en: 'MD4: Rivest 128-bit hash, 3 rounds of 16 steps.',
  },
  description: {
    zh: 'MD4（Rivest 1990）128 位哈希，3 轮 × 16 步，使用 F/G/H 布尔函数与模 2^32 加法。MD5/SHA 系列的基础。',
    en: 'MD4 (Rivest 1990) is a 128-bit hash with 3 rounds × 16 steps using F/G/H Boolean functions and mod-2^32 addition; basis for MD5/SHA family.',
  },
  tags: ['crypto', 'md4', 'hash', 'merkle-damgard'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
