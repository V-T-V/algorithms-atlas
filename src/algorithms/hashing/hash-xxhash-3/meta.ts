// hash-xxhash-3 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-xxhash-3',
  categoryId: 'hashing',
  title: { zh: 'XXH3', en: 'XXH3' },
  summary: {
    zh: 'XXH3：xxHash 第 3 代，混合了通用与 SIMD 路径，当前最快的 64 位哈希。',
    en: 'XXH3: 3rd generation xxHash combining scalar and SIMD paths, the fastest 64-bit hash to date.',
  },
  description: {
    zh: 'XXH3（Collet）：\n\n- xxHash 系列最新版，2019 年发布。\n- 用 secret stripes + accumulate 模式。\n- 在长输入上比 XXH64 快 2 倍。本实现为简化 64 位 BigInt 版。',
    en: 'XXH3 (Collet):\n\n- Latest xxHash version released 2019.\n- Uses secret stripes + accumulate pattern.\n- 2x faster than XXH64 on long inputs. Simplified 64-bit BigInt variant here.',
  },
  tags: ['hashing', 'non-cryptographic', 'xxhash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
