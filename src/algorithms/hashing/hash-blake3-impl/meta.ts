// BLAKE3（简化变体） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-blake3-impl',
  categoryId: 'hashing',
  title: { zh: 'BLAKE3（简化变体）', en: 'BLAKE3 (simplified variant)' },
  summary: {
    zh: 'BLAKE3 变体：Merkle 树式并行哈希，比 BLAKE2 更快。',
    en: 'BLAKE3 variant: Merkle-tree parallel hash, faster than BLAKE2.',
  },
  description: {
    zh: 'BLAKE3 简化变体：采用与 hash-blake3 相同的 Merkle 模式但不同的 IV 与混合常数，便于教学对比。',
    en: 'BLAKE3 simplified variant: same Merkle mode as hash-blake3 but different IV and mixing constants, for teaching comparison.',
  },
  tags: ['hashing', 'cryptographic', 'blake', 'merkle-tree'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
