// RIPEMD（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-ripemd-impl',
  categoryId: 'hashing',
  title: { zh: 'RIPEMD（简化）', en: 'RIPEMD (simplified)' },
  summary: {
    zh: 'RIPEMD：欧洲研发的 128 位哈希，两条并行链。',
    en: 'RIPEMD: European 128-bit hash with two parallel chains.',
  },
  description: {
    zh: 'RIPEMD（RACE Integrity）：两条并行链 r 和 l 各自压缩后合并，增强抗碰撞。简化 256 位教学版。',
    en: 'RIPEMD (RACE Integrity): two parallel chains r and l compressed independently then merged for collision resistance. Simplified 256-bit teaching version.',
  },
  tags: ['hashing', 'cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
