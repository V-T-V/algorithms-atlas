// hash-spooky · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-spooky',
  categoryId: 'hashing',
  title: { zh: 'SpookyHash', en: 'SpookyHash' },
  summary: {
    zh: 'SpookyHash V2：Bob Jenkins 设计的高速 64 位哈希，用于非加密场景。',
    en: 'SpookyHash V2: high-speed 64-bit hash by Bob Jenkins for non-cryptographic use.',
  },
  description: {
    zh: 'SpookyHash V2（Jenkins）：\n\n- 用 12 个工作字并行混合，每轮 End 才合并。\n- 抗雪崩失败，比 Murmur 更快。\n- 作者用于游戏、数据库索引。本实现为简化 64 位 BigInt 版。',
    en: 'SpookyHash V2 (Jenkins):\n\n- Mixes 12 working words in parallel, only merging at End rounds.\n- Resists avalanche failure, faster than Murmur.\n- Used by the author for games and database indices. Simplified 64-bit BigInt variant here.',
  },
  tags: ['hashing', 'non-cryptographic', 'spooky', 'jenkins'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
