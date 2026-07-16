// hash-blake3 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-blake3',
  categoryId: 'hashing',
  title: { zh: 'BLAKE3', en: 'BLAKE3' },
  summary: {
    zh: 'BLAKE3：可并行化的 Merkle 树式哈希，比 BLAKE2 更快，支持 XOF。',
    en: 'BLAKE3: parallelizable Merkle-tree hash, faster than BLAKE2, supports XOF.',
  },
  description: {
    zh: 'BLAKE3（OConnor 等）：\n\n- 基于 BLAKE2 的 G 函数 + 二叉 Merkle 树分块。\n- 多线程并行压缩，吞吐量达 GB/s。\n- 支持可扩展输出（XOF）、密钥模式。本实现为简化 256 位 BigInt 版（不并行）。',
    en: 'BLAKE3 (OConnor et al.):\n\n- BLAKE2 G-function + binary Merkle tree chunking.\n- Multi-threaded compression, GB/s throughput.\n- Supports XOF and keyed mode. Simplified 256-bit BigInt variant here (single-threaded).',
  },
  tags: ['hashing', 'cryptographic', 'blake', 'merkle-tree'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
