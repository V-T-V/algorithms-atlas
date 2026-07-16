// hash-xxhash-64 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-xxhash-64',
  categoryId: 'hashing',
  title: { zh: 'xxHash64', en: 'xxHash64' },
  summary: {
    zh: 'xxHash 64 位：4×64 位累加器 + 末尾合并，极快非加密哈希。',
    en: 'xxHash 64-bit: four 64-bit accumulators plus a final merge; an ultra-fast non-cryptographic hash.',
  },
  description: {
    zh: 'xxHash64（Yann Collet）：\n\n- 4 个 64 位累加器 v1..v4 = seed + PRIME 的组合。\n- 每 32 字节一块，4 路并行混合：v = rotl(v + k*PRIME2, 31)*PRIME1。\n- 合并 4 个累加器，处理尾部，最后用 avalanche 收敛。\n- 本实现用 BigInt 表达 64 位运算。',
    en: 'xxHash64 (Yann Collet):\n\n- Four 64-bit accumulators v1..v4 seeded with seed + PRIME.\n- Mix 32 bytes per block across 4 lanes: v = rotl(v + k*PRIME2, 31)*PRIME1.\n- Merge the 4 lanes, process the tail, converge with avalanche.\n- BigInt is used for the 64-bit arithmetic.',
  },
  tags: ['hashing', 'non-cryptographic', 'fast', 'xxhash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
