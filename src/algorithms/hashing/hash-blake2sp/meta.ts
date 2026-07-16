// BLAKE2sp · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-blake2sp',
  categoryId: 'hashing',
  title: { zh: 'BLAKE2sp', en: 'BLAKE2sp' },
  summary: {
    zh: 'BLAKE2sp：8 路并行 BLAKE2 变种，针对短输入 SIMD 优化。',
    en: 'BLAKE2sp: 8-way parallel BLAKE2 variant tuned for short-input SIMD.',
  },
  description: {
    zh: 'BLAKE2sp：8 路并行子哈希，比 bp 路数更多，适合短消息。简化 BigInt 教学版。',
    en: 'BLAKE2sp: 8-way parallel sub-hashes, more lanes than bp, suited to short messages. Simplified BigInt teaching version.',
  },
  tags: ['hashing', 'cryptographic', 'blake'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
