// hash-fowler-noll-vo · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-fowler-noll-vo',
  categoryId: 'hashing',
  title: { zh: 'FNV-1a 64 位', en: 'FNV-1a 64-bit' },
  summary: {
    zh: 'FNV-1a 64 位：hash ^= c; hash *= 1099511628211，BigInt 实现。',
    en: 'FNV-1a 64-bit: hash ^= c; hash *= 1099511628211, BigInt implementation.',
  },
  description: {
    zh: 'FNV-1a 64 位（Fowler-Noll-Vo）：\n\n- 初始 offset = 14695981039346656037。\n- 每字节：hash ^= c; hash *= 1099511628211。\n- 简单且分布良好，64 位 BigInt 实现。',
    en: 'FNV-1a 64-bit (Fowler-Noll-Vo):\n\n- Initial offset = 14695981039346656037.\n- Per byte: hash ^= c; hash *= 1099511628211.\n- Simple and well-distributed; 64-bit BigInt impl.',
  },
  tags: ['hashing', 'non-cryptographic', 'fnv'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
